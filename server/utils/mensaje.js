//npm install expect mocha --save-dev
var generarMensaje = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
};

module.exports = {generarMensaje};