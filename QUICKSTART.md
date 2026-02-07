# 🚀 Quick Start Guide

## Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Step 2: Start MongoDB

Make sure MongoDB is running on your system:
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or manually
mongod
```

**Alternative:** Use MongoDB Atlas (cloud) - just update the `MONGODB_URI` in `backend/.env`

## Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend runs on http://localhost:3000

## Step 4: Use the App

1. Open http://localhost:3000
2. Click "Sign up" and create an account
3. Login with your credentials
4. Click "+ Post Activity" to create your first activity
5. Browse activities and filter by category!

## Troubleshooting

**MongoDB Connection Error?**
- Make sure MongoDB is running
- Check `backend/.env` has correct `MONGODB_URI`

**Port Already in Use?**
- Change `PORT` in `backend/.env`
- Change `port` in `frontend/vite.config.js`

**CORS Issues?**
- Make sure both servers are running
- Check proxy settings in `frontend/vite.config.js`

## What's Built

✅ Complete authentication system (JWT)
✅ User signup/login with validation
✅ Create activity posts with categories
✅ Activity feed with real-time updates
✅ Filter activities by category
✅ Immediate vs scheduled activities
✅ Beautiful, responsive UI with Tailwind
✅ Protected routes and API endpoints
✅ MongoDB database integration

## Next Steps

Now that the MVP is working, you can add:
- Join activity functionality
- Real-time chat between users
- Notifications
- Location-based filtering
- User profiles
- Rating system

