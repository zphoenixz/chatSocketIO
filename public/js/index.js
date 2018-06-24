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
  var formattedTime = moment(mensaje.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    texto: mensaje.text,
    from: mensaje.from,
    createdAt: formattedTime
  });

  jQuery('#messages1').append(html);
});
//--
socket.on('newLocationMessage', function (mensaje) {
  var formattedTime = moment(mensaje.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: mensaje.from,
    url: mensaje.url,
    createdAt: formattedTime
  });

  jQuery('#messages1').append(html);

});


//Atrapar informacion del html
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();//Previene que aparezca el mensaje en el buscador = http://localhost:3000/?message=hola
  
  var messageTextbox = jQuery('[name=message1]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function (){
    messageTextbox.val('');
  });  
});
//--
var BotonUbicacion = jQuery('#send-location');
//--
BotonUbicacion.on('click', function (){//Cuando se haga click en el boton de ubicacion
  if(!navigator.geolocation){
    return alert('Geolocalizacion no soportada por tu Navegador');
  }
  BotonUbicacion.attr('disabled', 'disabled').text('Enviando ubicación...');//desactivo el boton mientras se manda la ubicacion
  navigator.geolocation.getCurrentPosition(function (position) {
    //console.log(position);
    BotonUbicacion.removeAttr('disabled').text('Enviar Ubicación');//activo el boton una vez se mando
    socket.emit('createLocationMessage', {
      latitud: position.coords.latitude,
      longitud: position.coords.longitude
    });
  }, function () {
    BotonUbicacion.removeAttr('disabled').text('Enviar Ubicación');//activo el boton si fallo el envio
    alert('No se pudo obtener la ubicacion');
  })
});//--