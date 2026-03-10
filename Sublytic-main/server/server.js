const express = require('express');
const http = require('http'); // Import Node's built-in HTTP module
const { Server } = require("socket.io"); // Import the Server class from socket.io
const cors = require('cors');
require('dotenv').config();
const userSettingsRouter = require('./userSettings');

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app

// --- CORS Configuration ---
// This single configuration block is sufficient.
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// --- Make io accessible to your routes ---
// This middleware attaches the io instance to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);

  // You can listen for custom events from the client
  // For example, the client could send its username upon connecting
  socket.on('registerUser', (username) => {
    socket.join(username); // Place the user's socket in a "room" named after their username
    console.log(`User '${username}' joined their notification room.`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected with socket ID:', socket.id);
  });
});

app.use('/api/user', userSettingsRouter);
const PORT = process.env.PORT || 5000;
// Use server.listen instead of app.listen
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));