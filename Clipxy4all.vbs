' Clipxy4all.vbs ? the Start Menu / Desktop shortcut target.
' Hides the PowerShell launcher window completely so double-clicking this
' feels like opening a normal desktop app, not running a script.
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
On Error Resume Next
shortDir = fso.GetFolder(dir).ShortPath
If Err.Number = 0 And Len(shortDir) > 0 Then dir = shortDir
Err.Clear
On Error GoTo 0
Set shell = CreateObject("WScript.Shell")
cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & dir & "\Launch.ps1"""
shell.Run cmd, 0, False
