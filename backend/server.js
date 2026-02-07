require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GoTogether API' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/points', require('./routes/points'));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Handle chat requests
  socket.on('send-chat-request', (data) => {
    const { fromUser, toUser, activity, requestType } = data;
    
    // Send notification to the target user
    socket.to(`user-${toUser}`).emit('chat-request-received', {
      fromUser: { _id: fromUser }, // Send user ID as object
      activity,
      requestType,
      timestamp: new Date()
    });
    
    console.log(`📨 Chat request sent from ${fromUser} to ${toUser}`);
  });

  // Handle request responses
  socket.on('respond-to-request', (data) => {
    const { fromUser, toUser, activity, response } = data;
    
    // Send response to the requester
    socket.to(`user-${toUser}`).emit('request-response', {
      fromUser: { _id: fromUser }, // Send user ID as object
      activity,
      response,
      timestamp: new Date()
    });
    
    console.log(`📨 Request response sent from ${fromUser} to ${toUser}: ${response}`);
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    const { toUser, message, fromUser } = data;
    
    // Send message to the target user
    socket.to(`user-${toUser}`).emit('new-message', {
      fromUser: { _id: fromUser }, // Send user ID as object
      message,
      timestamp: new Date()
    });
    
    console.log(`💬 Message sent from ${fromUser} to ${toUser}`);
  });

  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

