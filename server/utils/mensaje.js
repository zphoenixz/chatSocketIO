var moment = require('moment');

var generarMensaje = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};

var generarMensajeGeolocalizado = (from, latitud, longitud) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitud},${longitud}`,
        createdAt: moment().valueOf()
    };
};
module.exports = {generarMensaje, generarMensajeGeolocalizado};