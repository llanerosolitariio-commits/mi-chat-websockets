const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('chat message', (data) => {
    // Ahora 'data' contiene {user: "Nombre", text: "Hola"}
    // Reenviamos ese mismo objeto a todos
    io.emit('chat message', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Servidor en puerto ' + PORT);
});
