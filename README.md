# GoTogether 🤝

Find companions for everyday activities - grocery trips, walks, carpooling, and more!

## Tech Stack

**Frontend:**
- React with Vite
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Node.js + Express
- MongoDB
- JWT Authentication
- bcryptjs

## Project Structure

```
GoTogether/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB models (User, Activity)
│   ├── routes/          # API routes (auth, activities)
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── context/     # React context (Auth)
    │   └── utils/       # Utilities and helpers
    └── public/
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone and navigate to the project:**
```bash
cd GoTogether
```

2. **Setup Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gotogether
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

3. **Setup Frontend:**
```bash
cd ../frontend
npm install
```

### Running the Application

**Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

**Start Backend (in backend directory):**
```bash
npm run dev
```
Backend will run on http://localhost:5000

**Start Frontend (in frontend directory):**
```bash
npm run dev
```
Frontend will run on http://localhost:3000

## Features

### Current (MVP)
- ✅ User authentication (signup/login)
- ✅ Create activity posts
- ✅ View activity feed
- ✅ Filter by category
- ✅ Immediate vs scheduled activities
- ✅ User profiles with age & gender

### Upcoming
- 🔜 Join activity requests
- 🔜 In-app messaging
- 🔜 User ratings & reviews
- 🔜 Location-based search
- 🔜 Notifications
- 🔜 Privacy settings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Activities
- `POST /api/activities` - Create activity (protected)
- `GET /api/activities` - Get all activities (protected)
- `GET /api/activities/:id` - Get single activity (protected)
- `PUT /api/activities/:id` - Update activity (protected)
- `DELETE /api/activities/:id` - Delete activity (protected)

## Usage

1. **Sign up** for a new account
2. **Login** with your credentials
3. **Browse activities** on the dashboard
4. **Filter** by category (grocery, walk, carpool, etc.)
5. **Post** a new activity using the "+ Post Activity" button
6. View activities from other users and join them!

## Contributing

This is the initial MVP. Future enhancements will include matching algorithms, real-time chat, and advanced safety features.

## License

ISC

