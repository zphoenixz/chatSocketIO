var socket = io();

function scrollToBottom(){
  //Selectors
  var messages = jQuery('#messages1');
  var newMessage = messages.children('li:last-child');//El ultimo hijo (mensaje) que se agrega a "li"
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}
//--
socket.on('connect', function () { //Un usuario se conecta---------
  //console.log('Connected to server');
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {//para los parametros de join
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('No error');
    }
  });
});
//--
socket.on('disconnect', function () {//Un usuario se desconecta---------------
  console.log('Disconnected from server');
});
//--
socket.on('updateUserList', function (users) {//Se actualiza la lista de usuarios en linea---------------
  console.log('Lista de usuarios', users);
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
});


//Atrapar informacion del html
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();//Previene que aparezca el mensaje en el buscador = http://localhost:3000/?message=hola
  
  var messageTextbox = jQuery('[name=message1]');

  socket.emit('createMessage', {
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