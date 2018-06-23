const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generarMensaje} = require('./utils/mensaje');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

//Conectar lado servidor ------------
io.on('connection', (socket) => {
  console.log('New user connected');
  //Mensaje solo a la conexion actual
  socket.emit('MsjAlCliente', generarMensaje('Admin', 'Bienvenido a la sala de chat'));
  //Mensaje de para todos de que hay un nuevo ususario, menos para la 
  //conexion actual--.-.-.-.-
  socket.broadcast.emit('MsjAlCliente', generarMensaje('Admin', 'Un nuevo usuario se ha unido'));

  socket.on('MsjAlServidor', (mensaje, callback) => {//Recibir un callback Acknowledgement
    console.log('Msj del servidor al cliente', mensaje);
    io.emit('MsjAlCliente', generarMensaje( mensaje.from, mensaje.text));//Manda el msj a todas las conexiones
    callback('This is from the server.');
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});
//Conectar lado servidor ------------
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
