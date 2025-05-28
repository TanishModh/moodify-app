# MoodifyMe - Deployment Guide

This guide will walk you through deploying the MoodifyMe application to production.

## Backend Deployment (Render)

1. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `moodifyme-backend`
     - Region: Choose the one closest to your users
     - Branch: `main`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn backend.wsgi:application`

2. **Configure Environment Variables**
   Add these environment variables in the Render dashboard:
   ```
   PYTHON_VERSION=3.9.16
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-render-app-url.onrender.com,localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
   ```

3. **Add a PostgreSQL Database (Optional but recommended for production)**
   - In Render Dashboard, create a new PostgreSQL database
   - Get the database URL and add it as `DATABASE_URL` environment variable

## Frontend Deployment (Vercel)

1. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Create React App
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Install Command: `npm install`

2. **Configure Environment Variables**
   Add these environment variables in the Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-render-app.onrender.com
   ```

3. **Deploy**
   - Click "Deploy" and wait for the deployment to complete
   - Your frontend will be available at the provided Vercel URL

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-render-app.onrender.com,localhost,127.0.0.1
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
TMDB_API_KEY=your_tmdb_api_key
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-render-app.onrender.com
```

## Post-Deployment

1. **Verify Backend**
   - Visit `https://your-render-app.onrender.com/api/` to check if the API is running
   - Test the API endpoints using Postman or curl

2. **Verify Frontend**
   - Visit your Vercel URL
   - Test the application flow to ensure it's communicating with the backend

## Troubleshooting

- **CORS Issues**: Ensure `CORS_ALLOWED_ORIGINS` in the backend includes your frontend URL
- **Database Connection**: Check the database URL and ensure the database is accessible
- **Environment Variables**: Verify all required environment variables are set correctly
- **Logs**: Check the logs in both Render and Vercel dashboards for any errors
