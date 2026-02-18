Start-Process powershell -ArgumentList "-NoExit","-Command","cd backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit","-Command","cd frontend; npm run dev"
