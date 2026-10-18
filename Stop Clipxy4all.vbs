' Stop only the bundled Clipxy4all backend belonging to this installation.
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
On Error Resume Next
shortDir = fso.GetFolder(dir).ShortPath
If Err.Number = 0 And Len(shortDir) > 0 Then dir = shortDir
Err.Clear
On Error GoTo 0
Set shell = CreateObject("WScript.Shell")
cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & dir & "\Launch.ps1"" -Stop"
result = shell.Run(cmd, 0, True)
If result = 0 Then
  MsgBox "Clipxy4all has been stopped.", 64, "Clipxy4all"
End If
