@echo off
echo Installing Scala Front-End Dependencies...
cd src
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
npx tailwindcss init -p
echo Dependencies installed successfully.
@echo on
msg * Dependencies installed!
pause