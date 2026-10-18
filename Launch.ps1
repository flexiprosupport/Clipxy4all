<# Starts the bundled local server, or stops this installation with -Stop. #>
param([switch]$Stop, [switch]$FunctionsOnly)

function Test-Clipxy4allProcess($Process, [string]$InstallRoot) {
  $expected = [IO.Path]::GetFullPath((Join-Path $InstallRoot 'python\python.exe'))
  return ($Process.ExecutablePath -and
    [string]::Equals($Process.ExecutablePath, $expected, [StringComparison]::OrdinalIgnoreCase) -and
    $Process.CommandLine -match '(?i)(?:^|\s)-m\s+uvicorn\s+app\.main:app(?:\s|$)')
}

function Get-Clipxy4allProcesses([string]$InstallRoot) {
  Get-CimInstance Win32_Process -Filter "Name = 'python.exe'" -ErrorAction Stop |
    Where-Object { Test-Clipxy4allProcess $_ $InstallRoot }
}

function Get-Clipxy4allPortPlan([string]$InstallRoot) {
  # Reuse an existing process even while it is still starting. Never kill a
  # listener merely because its executable happens to be Python.
  foreach ($process in @(Get-Clipxy4allProcesses $InstallRoot)) {
    if ($process.CommandLine -match '(?:^|\s)--port\s+(80(?:0[0-9]|1[0-5]))(?:\s|$)') {
      return @{ Port = [int]$Matches[1]; ProcessId = [int]$process.ProcessId; Existing = $true }
    }
  }
  $occupied = @([Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners() |
    ForEach-Object { $_.Port })
  foreach ($candidatePort in 8000..8015) {
    if ($candidatePort -in $occupied) { continue }
    $probe = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $candidatePort)
    try {
      $probe.Start()
      return @{ Port = $candidatePort; ProcessId = $null; Existing = $false }
    } catch [Net.Sockets.SocketException] {
    } finally { $probe.Stop() }
  }
  throw 'Ports 8000 through 8015 are unavailable. Free one of these ports and try again.'
}

function Test-Clipxy4allHealth([int]$Port, [int]$ProcessId) {
  try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/health" -UseBasicParsing -TimeoutSec 1 -MaximumRedirection 0 -ErrorAction Stop
    $body = $response.Content | ConvertFrom-Json -ErrorAction Stop
    # Legacy running versions lack app/pid; the caller has already verified
    # their executable and uvicorn command against this installation.
    return ($response.StatusCode -eq 200 -and $body.status -eq 'ok' -and
      (($body.app -eq 'clipxy4all-v3' -and $body.pid -eq $ProcessId) -or
        (-not $body.app -and $body.PSObject.Properties.Name -contains 'device')))
  } catch { return $false }
}

function Show-Clipxy4allError([string]$Message) {
  Add-Type -AssemblyName PresentationFramework
  [System.Windows.MessageBox]::Show($Message, 'Clipxy4all',
    [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Warning) | Out-Null
}

function Get-Clipxy4allStartupLogDir() {
  $localData = [Environment]::GetFolderPath('LocalApplicationData')
  if (-not $localData) { throw 'Windows did not provide a Local AppData folder for startup diagnostics.' }
  $directory = Join-Path $localData 'Clipxy4all\logs'
  [IO.Directory]::CreateDirectory($directory) | Out-Null
  return $directory
}

function Assert-Clipxy4allWritable([string]$InstallRoot) {
  # Clipxy4all stores temporary work beside the installation. Detect a protected
  # custom install location before Python exits with an opaque PermissionError.
  $tempDir = Join-Path $InstallRoot 'temp'
  try {
    [IO.Directory]::CreateDirectory($tempDir) | Out-Null
    $probe = Join-Path $tempDir ('.clipxy4all-write-test-' + [guid]::NewGuid().ToString('N'))
    $stream = [IO.File]::Open($probe, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try { $stream.Dispose() } finally { [IO.File]::Delete($probe) }
  } catch {
    throw "Clipxy4all cannot write to $tempDir. Install it in a folder your Windows account can write to, then try again."
  }
}

function Get-Clipxy4allStartupFailure([string]$ErrorLog, $ExitCode) {
  $detail = $null
  try {
    if ($ErrorLog -and (Test-Path -LiteralPath $ErrorLog)) {
      $detail = Get-Content -LiteralPath $ErrorLog -Tail 25 -ErrorAction Stop |
        Where-Object { $_.Trim() } | Select-Object -Last 1
    }
  } catch { } # The log path is still useful if antivirus temporarily locks it.
  if ($detail -and $detail.Length -gt 300) { $detail = $detail.Substring(0, 300) + '...' }
  $code = if ($null -ne $ExitCode) { " (exit code $ExitCode)" } else { '' }
  $message = "Clipxy4all stopped during startup$code."
  if ($detail) { $message += "`n`nLast error: $detail" }
  if ($ErrorLog) { $message += "`n`nStartup log: $ErrorLog" }
  return $message
}

if ($FunctionsOnly) { return }
$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
$lockHeld = $false
$mutex = $null
try {
  # Serialize launch/stop for this installation so repeated double-clicks
  # cannot start two servers sharing the same temp and history directories.
  $hasher = [Security.Cryptography.SHA256]::Create()
  try {
    $hash = [BitConverter]::ToString($hasher.ComputeHash([Text.Encoding]::UTF8.GetBytes($Root.ToLowerInvariant()))).Replace('-', '')
  } finally { $hasher.Dispose() }
  $mutex = [Threading.Mutex]::new($false, "Local\Clipxy4all-v3-$hash")
  try { $lockHeld = $mutex.WaitOne(60000) }
  catch [Threading.AbandonedMutexException] { $lockHeld = $true }
  if (-not $lockHeld) { throw 'Clipxy4all is still starting or stopping. Please try again shortly.' }

  if ($Stop) {
    foreach ($process in @(Get-Clipxy4allProcesses $Root)) {
      # Recheck identity immediately before stopping; do not target ports.
      $current = Get-CimInstance Win32_Process -Filter "ProcessId = $($process.ProcessId)" -ErrorAction Stop
      if ($current -and (Test-Clipxy4allProcess $current $Root)) {
        Stop-Process -Id $current.ProcessId -Force -ErrorAction Stop
      }
    }
    return
  }

  $py = Join-Path $Root 'python\python.exe'
  if (-not (Test-Path -LiteralPath $py -PathType Leaf)) {
    throw 'Bundled Python not found. Please reinstall Clipxy4all.'
  }
  Assert-Clipxy4allWritable $Root
  $env:PATH = "$Root\ffmpeg;$Root\python;$env:PATH"
  $env:HF_HOME = "$Root\models"
  $env:HUGGINGFACE_HUB_CACHE = "$Root\models\hub"
  $env:HF_HUB_DISABLE_TELEMETRY = '1'
  $env:HF_HUB_DISABLE_SYMLINKS_WARNING = '1'
  $env:HF_HUB_OFFLINE = '1'
  $env:TRANSFORMERS_OFFLINE = '1'
  $workTemp = Join-Path $Root 'temp'
  [IO.Directory]::CreateDirectory($workTemp) | Out-Null

  $plan = Get-Clipxy4allPortPlan $Root
  $port = $plan.Port
  $errorLog = $null
  if ($plan.Existing) {
    $serverId = $plan.ProcessId
  } else {
    $logDir = Get-Clipxy4allStartupLogDir
    $errorLog = Join-Path $logDir 'startup.stderr.log'
    $outputLog = Join-Path $logDir 'startup.stdout.log'
    # Only bundled Python needs the app work directory. Keep the user's normal
    # TEMP/TMP for the browser; Edge/Chrome otherwise create locked cache files
    # under Clipxy4all's temp folder when opening the page.
    $userTemp = $env:TEMP
    $userTmp = $env:TMP
    try {
      $env:TEMP = $workTemp
      $env:TMP = $workTemp
      $server = Start-Process -FilePath $py `
        -ArgumentList '-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', "$port" `
        -WorkingDirectory $Root -WindowStyle Hidden -PassThru `
        -RedirectStandardError $errorLog -RedirectStandardOutput $outputLog
    } finally {
      $env:TEMP = $userTemp
      $env:TMP = $userTmp
    }
    $serverId = $server.Id
  }

  $ready = $false
  for ($attempt = 0; $attempt -lt 90; $attempt++) {
    if (-not (Get-Process -Id $serverId -ErrorAction SilentlyContinue)) {
      $exitCode = $null
      if (-not $plan.Existing) {
        try { $server.Refresh(); $exitCode = $server.ExitCode } catch { }
      }
      throw (Get-Clipxy4allStartupFailure $errorLog $exitCode)
    }
    if (Test-Clipxy4allHealth $port $serverId) { $ready = $true; break }
    Start-Sleep -Milliseconds 350
  }
  if (-not $ready) {
    $message = 'Clipxy4all has not become ready yet. Try the shortcut again to reconnect to this server.'
    if ($errorLog) { $message += "`n`nStartup log: $errorLog" }
    throw $message
  }
  Start-Process "http://127.0.0.1:$port"
} catch {
  Show-Clipxy4allError $_.Exception.Message
  exit 1
} finally {
  if ($lockHeld) { $mutex.ReleaseMutex() }
  if ($mutex) { $mutex.Dispose() }
}
