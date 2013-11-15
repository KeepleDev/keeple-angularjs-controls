call grunt test --no-color > output.txt
if "%ERRORLEVEL%" == "3" (
output.txt
exit /B 3
)