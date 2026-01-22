# Deployment Guide

Complete step-by-step guide to deploy the Product & Order Management System to production.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Render/Railway account (for backend)
- Vercel/Netlify account (for frontend)
- Gemini API key (optional, for AI features)

## 🗄️ Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (choose free tier M0)
4. Create database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
5. Whitelist IP address:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add specific IPs for production
6. Get connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/product_order_management?retryWrites=true&w=majority`

## 🔧 Step 2: Get Gemini API Key (Optional)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the API key (you'll need this for backend)

## 🚀 Step 3: Deploy Backend (Render)

### Option A: Render

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository with your code

3. **Configure Service**
   - **Name**: `product-order-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   Click "Environment" and add:
   ```
   PORT=10000
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=generate-a-random-secure-string-here
   CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ADMIN_NAME=Admin User
   GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://product-order-backend.onrender.com`)

### Option B: Railway

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**
   - Railway auto-detects Node.js
   - Set root directory to `backend`
   - Set start command: `npm start`

4. **Set Environment Variables**
   - Go to "Variables" tab
   - Add all environment variables (same as Render above)

5. **Deploy**
   - Railway auto-deploys on push
   - Note the service URL

## 🎨 Step 4: Deploy Frontend (Vercel)

### Option A: Vercel

1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```
   - Replace with your actual backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Note the frontend URL (e.g., `https://product-order-app.vercel.app`)

### Option B: Netlify

1. **Create Netlify Account**
   - Go to [Netlify](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository

3. **Configure Build**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Set Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add `VITE_API_URL` with your backend URL

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment

## 🔄 Step 5: Update Backend CORS

After deploying frontend, update backend environment variable:

1. Go to your backend service (Render/Railway)
2. Update `CLIENT_ORIGIN` environment variable:
   ```
   CLIENT_ORIGIN=https://your-frontend-url.vercel.app
   ```
3. Redeploy backend (or it will auto-redeploy)

## ✅ Step 6: Verify Deployment

1. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"success":true,"message":"API is healthy"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Try to register/login
   - Test product browsing
   - Test order creation

3. **Test Admin Features**
   - Login with admin credentials
   - Try creating a product
   - Try viewing all orders

## 🔐 Security Checklist

- [ ] JWT_SECRET is a strong random string (use: `openssl rand -base64 32`)
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] Database user has strong password
- [ ] CORS is set to your frontend domain only
- [ ] Environment variables are set correctly
- [ ] Admin password is changed from default

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- Check environment variables are set correctly
- Check MongoDB connection string
- Check logs in Render/Railway dashboard

**Problem**: CORS errors
- Verify `CLIENT_ORIGIN` matches your frontend URL exactly
- Include `https://` in the URL
- No trailing slash

**Problem**: Database connection fails
- Verify MongoDB Atlas IP whitelist includes Render/Railway IPs
- Check connection string has correct password
- Verify database name in connection string

### Frontend Issues

**Problem**: API calls fail
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors
- Verify backend is running and accessible

**Problem**: Build fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Vercel/Netlify

## 📊 Monitoring

### Render
- View logs in "Logs" tab
- Monitor metrics in "Metrics" tab

### Railway
- View logs in "Deployments" tab
- Check "Metrics" for resource usage

### Vercel
- View logs in "Deployments" → Click deployment → "Functions" tab
- Monitor analytics in "Analytics" tab

## 🔄 Continuous Deployment

Both Render and Vercel automatically deploy on git push:
1. Make changes locally
2. Commit and push to GitHub
3. Deployment happens automatically

## 💰 Cost Estimation

**Free Tier Limits:**
- **MongoDB Atlas**: 512MB storage, shared cluster
- **Render**: 750 hours/month (enough for 1 service 24/7)
- **Vercel**: Unlimited for personal projects
- **Railway**: $5 credit/month (free tier available)

**For Production:**
- Consider paid plans for better performance
- MongoDB Atlas: $9/month for M10 cluster
- Render: $7/month for always-on service

## 📝 Post-Deployment

1. **Change Admin Password**
   - Login with default admin
   - Update password (if you add this feature)

2. **Add Sample Products**
   - Login as admin
   - Create some products to test

3. **Test All Features**
   - User registration/login
   - Product browsing/search
   - Order creation
   - Admin features
   - AI assistant

## 🎉 You're Live!

Your application is now deployed and accessible to users worldwide!

---

**Need Help?**
- Check service-specific documentation
- Review error logs
- Test locally first before deploying
