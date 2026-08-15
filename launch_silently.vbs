Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c cd /d C:\Users\CHOKKALINGAM\OneDrive\Pictures\Documents\textile-waste-platform\backend && .\venv\Scripts\python run.py", 0, false
WshShell.Run "cmd.exe /c cd /d C:\Users\CHOKKALINGAM\OneDrive\Pictures\Documents\textile-waste-platform\frontend && npm run dev", 0, false
