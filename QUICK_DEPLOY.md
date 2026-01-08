# Quick Deployment Checklist

## Backend Deployment (Railway)

### Option 1: Railway CLI
```bash
cd backend_amazon
railway login
railway init
railway variables set DATABASE_URL="postgresql://postgres:ZQzwTiOPqxRGdtUzllbgIECgxmhKWIEd@shortline.proxy.rlwy.net:19996/railway"
railway variables set DB_SSL="false"
railway variables set FRONTEND_URL="https://amazon-clone-assignment.vercel.app"
railway up
railway domain
```

### Option 2: Railway Dashboard
1. Push to GitHub: `git add . && git commit -m "Configure for Railway" && git push`
2. Railway Dashboard → New Project → Deploy from GitHub
3. Select repo → Choose `backend_amazon` folder
4. Add environment variables:
   - `DATABASE_URL`: `postgresql://postgres:ZQzwTiOPqxRGdtUzllbgIECgxmhKWIEd@shortline.proxy.rlwy.net:19996/railway`
   - `DB_SSL`: `false`
   - `FRONTEND_URL`: `https://amazon-clone-assignment.vercel.app`
5. Settings → Networking → Generate Domain
6. Copy your Railway URL

## Frontend Update (Vercel)

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `REACT_APP_API_URL` to: `https://YOUR-RAILWAY-URL.up.railway.app/api`
3. Deployments → Redeploy

## Verify

```bash
# Test backend
curl https://YOUR-RAILWAY-URL.up.railway.app/

# Test frontend
# Open your Vercel URL and try to register/login
```

## Files Changed Summary

✅ `frontend_amazon/src/pages/Login.jsx` - Uses env variable  
✅ `frontend_amazon/src/pages/Register.jsx` - Uses env variable  
✅ `backend_amazon/server.js` - CORS configured  
✅ `backend_amazon/.env` - Added PORT, FRONTEND_URL  
✅ `backend_amazon/railway.json` - Railway config created  

**You're all set! Just deploy and test.** 🚀
