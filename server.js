const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Contador de likes
let likesCount = 0;

// Rutas REST
app.get('/api', (req, res) => {
  res.json({ likes: likesCount });
});

app.post('/api/like', (req, res) => {
  // Implementar contador
  likesCount++;

  io.emit('likeUpdated', likesCount);
  
  res.json({ likes: likesCount });
});

// Configuración de Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  // Enviar el contador actual al nuevo cliente
  socket.emit('likeUpdated', likesCount);
  
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});