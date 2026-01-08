# Railway Backend Deployment Guide

## Quick Setup Steps

### 1. Deploy Backend to Railway

#### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Navigate to backend directory**:
   ```bash
   cd backend_amazon
   ```

4. **Initialize Railway project**:
   ```bash
   railway init
   ```
   - Select "Create new project"
   - Name it something like "amazon-clone-backend"

5. **Link to existing database** (optional, if you want to use your existing Railway database):
   - Go to Railway dashboard
   - Add your existing database to the project
   - Copy the DATABASE_URL from your database service

6. **Set environment variables**:
   ```bash
   railway variables set DATABASE_URL="postgresql://postgres:ZQzwTiOPqxRGdtUzllbgIECgxmhKWIEd@shortline.proxy.rlwy.net:19996/railway"
   railway variables set DB_SSL="false"
   railway variables set FRONTEND_URL="https://amazon-clone-assignment.vercel.app"
   ```

7. **Deploy**:
   ```bash
   railway up
   ```

8. **Generate domain**:
   ```bash
   railway domain
   ```
   This will give you a public URL like: `https://your-project.up.railway.app`

#### Option B: Using Railway Dashboard (GitHub Integration)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Configure backend for Railway deployment"
   git push
   ```

2. **Go to [Railway Dashboard](https://railway.app/dashboard)**

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend_amazon` folder as the root directory

4. **Configure Environment Variables**:
   - Go to your project settings
   - Add these variables:
     - `DATABASE_URL`: `postgresql://postgres:ZQzwTiOPqxRGdtUzllbgIECgxmhKWIEd@shortline.proxy.rlwy.net:19996/railway`
     - `DB_SSL`: `false`
     - `FRONTEND_URL`: `https://amazon-clone-assignment.vercel.app`
     - `PORT`: Railway will auto-assign this, but you can set it to `5000` if needed

5. **Generate Domain**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the generated URL (e.g., `https://your-project.up.railway.app`)

### 2. Update Frontend Environment Variables

#### Update Vercel Environment Variables:

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Select your frontend project**

3. **Go to Settings → Environment Variables**

4. **Update `REACT_APP_API_URL`**:
   - Value: `https://your-railway-backend-url.up.railway.app/api`
   - Make sure to include `/api` at the end!

5. **Redeploy frontend**:
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

### 3. Update Local Frontend .env (Optional)

If you want to test with the production backend locally:

```bash
# frontend_amazon/.env
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app/api
```

### 4. Verify Deployment

1. **Test backend health endpoint**:
   ```bash
   curl https://your-railway-backend-url.up.railway.app/
   ```
   Should return: `{"message":"Amazon Clone API is running...","database":"Connected","timestamp":"..."}`

2. **Test products endpoint**:
   ```bash
   curl https://your-railway-backend-url.up.railway.app/api/products
   ```
   Should return array of 14 products

3. **Test frontend**:
   - Open your Vercel frontend URL
   - Try to register a new account
   - Try to login
   - Browse products
   - Add items to cart

## Environment Variables Summary

### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:ZQzwTiOPqxRGdtUzllbgIECgxmhKWIEd@shortline.proxy.rlwy.net:19996/railway
DB_SSL=false
PORT=5000
FRONTEND_URL=https://amazon-clone-assignment.vercel.app
```

### Frontend (.env)
```bash
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app/api
```

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Make sure `FRONTEND_URL` is set correctly in Railway
2. Verify your Vercel URL matches the one in the backend CORS configuration
3. Redeploy both frontend and backend

### Database Connection Issues
If backend can't connect to database:
1. Verify `DATABASE_URL` is correct in Railway environment variables
2. Make sure `DB_SSL=false` is set
3. Check Railway logs for specific error messages

### 404 Errors
If API endpoints return 404:
1. Make sure you're using `/api` prefix in frontend URLs
2. Verify backend routes are properly configured
3. Check Railway deployment logs

## Files Modified

### Frontend
- ✅ `src/pages/Login.jsx` - Uses environment variable for API URL
- ✅ `src/pages/Register.jsx` - Uses environment variable for API URL
- ✅ `.env` - Contains production API URL

### Backend
- ✅ `server.js` - CORS configured for Vercel frontend
- ✅ `.env` - Added PORT and FRONTEND_URL
- ✅ `railway.json` - Railway deployment configuration
- ✅ `db.js` - SSL configuration for Railway database
