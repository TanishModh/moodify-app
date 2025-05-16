# Start the Django backend server
Start-Process -FilePath "python" -ArgumentList "manage.py", "runserver" -WorkingDirectory "c:\Users\tmodh\Desktop\moodify git OG\Moodify-Emotion-Music-App-master\backend"

# Start the React frontend server
Start-Process -FilePath "cmd" -ArgumentList "/c", "npm start" -WorkingDirectory "c:\Users\tmodh\Desktop\moodify git OG\Moodify-Emotion-Music-App-master\frontend"
