const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

//Evento en el cliente---
io.on('connection', (socket) => {//registrar un event listener, nueva conexion
  console.log('New user connected');
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});
//Evento en el cliente---
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
