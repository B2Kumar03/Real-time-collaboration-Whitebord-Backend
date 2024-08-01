import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from "dotenv"

dotenv.config()
const PORT=process.env.PORT || 8080
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
  },
});

// Apply CORS middleware
app.use(cors());

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-room', (roomID) => {
    socket.join(roomID);
    console.log(`User joined room: ${roomID}`);
  });

  socket.on('canvas-update', (data) => {
    const { roomID, tool, color, lineWidth, x, y } = data;
    socket.to(roomID).emit('canvas-update', { tool, color, lineWidth, x, y });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
