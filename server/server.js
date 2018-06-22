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

//Conectar lado servidor ------------
io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit('EmailCliente', {
  //   from: 'mike@example.com',
  //   text: 'Hey. What is going on.',
  //   createAt: 123
  // });

  socket.emit('MsjCliente', {
    from: 'John',
    text: 'See you then.',
    createAt: 123123
  });

  socket.on('MsjServidor', (mensaje) => {
    console.log('Msj del servidor al cliente', mensaje);
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});
//Conectar lado servidor ------------
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
