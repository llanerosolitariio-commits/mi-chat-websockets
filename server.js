const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => { io.emit('chat message', msg); });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { console.log('Servidor en puerto ' + PORT); });
