var socket = io();
//Conectar lado servidor ------------
socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('MsjAlCliente', function (mensaje) {
  console.log('Msj del Cliente al Servidor', mensaje);
  var li = jQuery('<li></li>');//Listar dentro de la "ol" cada "li"
  li.text(`${mensaje.from}: ${mensaje.text}`);

  jQuery('#messages1').append(li);
});

//Conectar lado servidor ------------
//Atrapar informacion del html
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();//Previene que aparezca el mensaje en el buscador = http://localhost:3000/?message=hola

  socket.emit('MsjAlServidor', {
    from: 'User',
    text: jQuery('[name=message1]').val()
  }, function (){

  });  
});