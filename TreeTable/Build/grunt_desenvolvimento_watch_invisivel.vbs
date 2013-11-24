Set oShell = CreateObject ("Wscript.Shell") 
Dim strArgs
strArgs = "cmd /c grunt_desenvolvimento_watch.bat"
oShell.Run strArgs, 0, false