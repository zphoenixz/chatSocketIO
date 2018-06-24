//--------------------------------------
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generarMensaje, generarMensajeGeolocalizado} = require('./utils/mensaje');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

//--------------------------------------
app.use(express.static(publicPath));
//--------------------------------------
//Conectar lado servidor ------------
io.on('connection', (socket) => {
  console.log('New user connected');
 
  socket.on('join', (params, callback) => {//Un usuario se une!!!!!!!!!!
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Nickname y Room son requeridos');
    }

    socket.join(params.room);//Se une a un room
    users.removeUser(socket.id);//Lo borro para q no este en otro room
    users.addUser(socket.id, params.name, params.room);//lo añado

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generarMensaje('Admin', 'Bienvenido a la sala de chat')); //Mensaje solo a la conexion actual
    //Mensaje de para todos de que hay un nuevo ususario, menos para la conexion actual--.-.-.-.-
    socket.broadcast.to(params.room).emit('newMessage', generarMensaje('Admin', `${params.name} se ha unido`));
    callback();
  });

  socket.on('createMessage', (mensaje, callback) => {//Recibir un callback Acknowledgement
    //console.log('Msj del servidor al cliente', mensaje);
    var user = users.getUser(socket.id);

    if(user&& isRealString(mensaje.text)){
      io.to(user.room).emit('newMessage', generarMensaje( user.name, mensaje.text));//Manda el msj a todas las conexiones
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    
    var user = users.getUser(socket.id);
    
    if(user){
      io.to(user.room).emit('newLocationMessage', generarMensajeGeolocalizado(user.name, coords.latitud, coords.longitud));
    }
  });

  socket.on('disconnect', () => {//Un usuario se va !!!!!!!!!!
    //console.log('User was disconnected');
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generarMensaje('Admin', `${user.name} se ha retirado de la Sala.`));
    }
  });
});
//--------------------------------------
//Conectar lado servidor ------------
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
//--------------------------------------