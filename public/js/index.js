var socket = io();
//--
socket.on('connect', function () {
  console.log('Connected to server');
});
//--
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
//--
socket.on('newMessage', function (mensaje) {
  console.log('Msj del Cliente al Servidor', mensaje);
  var li = jQuery('<li></li>');//Listar dentro de la "ol" cada "li"
  li.text(`${mensaje.from}: ${mensaje.text}`);
  jQuery('#messages1').append(li);
});
//--
socket.on('newLocationMessage', function (mensaje) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My ubicación actual</a>');

  li.text(`${mensaje.from}: `);
  a.attr('href', mensaje.url);
  li.append(a);
  jQuery('#messages1').append(li);
});


//Atrapar informacion del html
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();//Previene que aparezca el mensaje en el buscador = http://localhost:3000/?message=hola
  
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message1]').val()
  }, function (){

  });  
  jQuery('[name=message1]').val("");
});
//--
var BotonUbicacion = jQuery('#send-location');
//--
BotonUbicacion.on('click', function (){//Cuando se haga click en el boton de ubicacion
  if(!navigator.geolocation){
    return alert('Geolocalizacion no soportada por tu Navegador');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    //console.log(position);
    socket.emit('createLocationMessage', {
      latitud: position.coords.latitude,
      longitud: position.coords.longitude
    });
  }, function () {
    alert('No se pudo obtener la ubicacion');
  })
});//--