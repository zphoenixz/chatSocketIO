//npm install expect mocha --save-dev
var generarMensaje = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
};

var generarMensajeGeolocalizado = (from, latitud, longitud) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitud},${longitud}`,
        createdAt: new Date().getTime()
    };
};
module.exports = {generarMensaje, generarMensajeGeolocalizado};