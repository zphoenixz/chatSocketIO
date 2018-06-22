var socket = io();
//Conectar lado servidor ------------
socket.on('connect', function () {
  console.log('Connected to server');

  // socket.emit('EmailServidor', {
  //     to: 'jen@example.com',
  //     text: 'Hey. This is Andrew.'
  // });

  // socket.emit('MsjServidor', {//Emite un evento a una conexion simple
  //   from: 'Andrew',
  //   text: 'Yup, that works for me.'
  // });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// socket.on('EmailCliente', function (email) {
//   console.log('Email del Cliente al Servidor', email);
// });
socket.on('MsjCliente', function (mensaje) {
  console.log('Msj del Cliente al Servidor', mensaje);
  // io.emit('MsjServidor', {//Emite un evento a cada conexion
  //   from: mensaje.from,
  //   text: mensaje.text,
  //   createdAt: new Date().getTime()
  // });
});
//Conectar lado servidor ------------
