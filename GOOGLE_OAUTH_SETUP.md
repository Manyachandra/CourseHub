# 🔐 Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your CourseHub application.

## 📋 Prerequisites

- Google Cloud Console account
- Node.js backend server running
- MongoDB database configured

## 🚀 Step 1: Google Cloud Console Setup

### 1.1 Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `CourseHub OAuth`
4. Click "Create"

### 1.2 Enable Google+ API
1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API" and click on it
3. Click "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - App name: CourseHub
   - User support email: your-email@domain.com
   - Developer contact information: your-email@domain.com
4. Click "Create OAuth 2.0 Client ID"
5. Application type: Web application
6. Name: CourseHub Web Client
7. Authorized redirect URIs: `http://localhost:5000/auth/google/callback`
8. Click "Create"

### 1.4 Copy Credentials
- **Client ID**: Copy this value
- **Client Secret**: Copy this value

## 🔧 Step 2: Environment Configuration

### 2.1 Create .env File
Create a `.env` file in your `server` directory:

```bash
# Database
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/coursehub

# Session
SESSION_SECRET=your-super-secret-session-key-here

# Client URL
CLIENT_URL=http://localhost:3000

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Environment
NODE_ENV=development
```

### 2.2 Replace Placeholder Values
- Replace `your-google-client-id` with your actual Google Client ID
- Replace `your-google-client-secret` with your actual Google Client Secret
- Update `MONGODB_URI` with your actual MongoDB connection string
- Generate a strong `SESSION_SECRET` (you can use: `openssl rand -hex 32`)

## 🖥️ Step 3: Frontend Configuration

The frontend is already configured with Google login buttons on:
- `/login` page
- `/register` page

## 🚀 Step 4: Test the Setup

### 4.1 Start the Backend Server
```bash
cd server
npm start
```

### 4.2 Start the Frontend
```bash
cd client
npm run dev
```

### 4.3 Test Google Login
1. Go to `http://localhost:3000/login`
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your app

## 🔍 Troubleshooting

### Common Issues:

#### 1. "redirect_uri_mismatch" Error
- Ensure the redirect URI in Google Cloud Console matches exactly: `http://localhost:5000/auth/google/callback`
- Check for trailing slashes or typos

#### 2. "invalid_client" Error
- Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure the `.env` file is in the server directory

#### 3. Session Not Persisting
- Check that `SESSION_SECRET` is set
- Ensure MongoDB is running and accessible
- Verify CORS settings match your frontend URL

#### 4. Google+ API Not Enabled
- Go to Google Cloud Console → APIs & Services → Library
- Search for and enable "Google+ API"

## 📱 Production Deployment

### Update Redirect URIs
When deploying to production, add your production domain to authorized redirect URIs:
- `https://yourdomain.com/auth/google/callback`

### Environment Variables
Update your production environment variables:
```bash
CLIENT_URL=https://yourdomain.com
NODE_ENV=production
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong session secrets** (32+ characters)
3. **Enable HTTPS** in production
4. **Regularly rotate** OAuth client secrets
5. **Monitor OAuth usage** in Google Cloud Console

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Express Session Documentation](https://github.com/expressjs/session)

## ✅ Verification Checklist

- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URI configured: `http://localhost:5000/auth/google/callback`
- [ ] `.env` file created with all required variables
- [ ] Backend server starts without errors
- [ ] Google login button appears on login/register pages
- [ ] Clicking Google login redirects to Google OAuth
- [ ] After authorization, user is redirected back to app
- [ ] User session is created and maintained

---

**Need Help?** Check the troubleshooting section above or review the Google Cloud Console error messages for specific guidance.
