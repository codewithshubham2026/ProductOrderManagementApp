# Quick Start Guide

Get the application running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
mongod --version # MongoDB should be installed (or use MongoDB Atlas)
```

## Step 1: Backend Setup (2 minutes)

```bash
cd backend
npm install
cp env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/product_order_management
JWT_SECRET=my-secret-key-change-this
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your-key-here  # Optional, leave empty if you don't have one
```

Start backend:
```bash
npm run dev
```

✅ Backend running on http://localhost:5000

## Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```bash
cd frontend
npm install
cp env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

✅ Frontend running on http://localhost:5173

## Step 3: Test the Application (1 minute)

1. Open http://localhost:5173 in browser
2. Click "Register" to create an account
3. Or login with default admin:
   - Email: `admin@example.com`
   - Password: `admin123`

## 🎉 You're Done!

**Next Steps:**
- Read [README.md](./README.md) for full documentation
- Check [LEARNING_ROADMAP.md](./LEARNING_ROADMAP.md) to understand the code
- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
- Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production

## Troubleshooting

**Backend won't start:**
- Check MongoDB is running: `mongod`
- Or use MongoDB Atlas and update `MONGO_URI` in `.env`

**Frontend can't connect to backend:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`

**CORS errors:**
- Verify `CLIENT_ORIGIN` in backend `.env` matches frontend URL

---

**Happy Coding! 🚀**
