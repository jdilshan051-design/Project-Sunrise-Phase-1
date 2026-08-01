const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Simulating live IoT sensor stream by sending data every 2 seconds
  const interval = setInterval(() => {
    // Randomly select a seat to update its SNR value and status
    const randomSeatNum = Math.floor(Math.random() * 20) + 1;
    const randomRow = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)];
    const seatId = `${randomRow}${randomSeatNum}`;

    const newSnr = parseFloat((Math.random() * 10 + 14).toFixed(2));
    const status = newSnr < 18.0 ? 'warning' : 'optimal';

    const livePacket = {
      seatId: seatId,
      snr: newSnr,
      status: status,
      packetLoss: (Math.random() * 1.5).toFixed(2) + '%'
    };

    // Broadcast the live telemetry packet to all connected browser dashboards
    socket.emit('liveTelemetry', livePacket);
  }, 2000);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

server.listen(3000, () => {
  console.log('Telemetry WebSocket Server is running on http://localhost:3000');
});