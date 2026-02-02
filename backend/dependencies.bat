@echo off
echo Installing Scala Back-End Dependencies...
cd src
npm i cors express dotenv
echo Dependencies installed successfully.
@echo on
msg * Dependencies installed!
pause