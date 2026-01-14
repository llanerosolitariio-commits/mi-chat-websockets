const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Base de datos temporal en memoria para las contraseñas de las salas
const salaPass = {}; 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  
  socket.on('join room', ({ room, password }) => {
    // Si la sala no tiene contraseña, la creamos con la que envíe el primero
    if (!salaPass[room]) {
      salaPass[room] = password;
    }

    // Verificar contraseña
    if (salaPass[room] === password) {
      socket.join(room);
      socket.emit('auth success');
      console.log(`Usuario unido a sala: ${room}`);
    } else {
      socket.emit('auth error', 'Contraseña incorrecta');
    }
  });

  socket.on('chat message', ({ room, user, text }) => {
    // Enviar mensaje SOLO a los miembros de esa sala
    io.to(room).emit('chat message', { user, text });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Servidor en puerto ' + PORT));
