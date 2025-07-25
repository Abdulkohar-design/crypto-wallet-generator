# Railway Deployment Instructions

## Quick Fix for Railway Deployment

### Option 1: Deploy Backend Only
1. Create new Railway project
2. Connect to GitHub repository
3. Set **Root Directory** to: `backend`
4. Set environment variables:
   ```
   NODE_ENV=production
   ```
5. Railway will auto-detect package.json in backend folder

### Option 2: Use Railway Template
1. Go to Railway dashboard
2. Click "New Project" → "Deploy from template"
3. Use this template URL: `https://github.com/USERNAME/crypto-wallet-generator`
4. Set root directory to `backend`

### Option 3: Manual Configuration
If Railway still fails, try these settings:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Root Directory:**
```
backend
```

**Environment Variables:**
```
NODE_ENV=production
PORT=$PORT
```

### Common Railway Issues & Fixes

1. **Build fails**: Make sure `backend/package.json` exists
2. **Start fails**: Check if `npm start` script exists in backend
3. **Port issues**: Railway auto-assigns PORT, make sure server.js uses `process.env.PORT`
4. **File structure**: Railway should point to `backend` directory

### Alternative: Deploy to Render
If Railway continues to fail:

1. Go to render.com
2. Connect GitHub repository
3. Choose "Web Service"
4. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `NODE_ENV=production`

### Test Backend Locally First
```bash
cd backend
npm install
npm start
```

Should show: `Server running on http://localhost:3001`