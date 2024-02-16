const Code = require('../enum/code.enum')
const Status = require('../enum/status.enum')

class HttpResponse {
    // parametros del constructor.
    constructor( statusCode = Code, httpStatus = Status, message, data ) {
        
        this.statusCode = statusCode;
        this.httpStatus = httpStatus;
        this.message = message;
        this.data = data;
        // propiedad que almacena la fecha y hora actuales en formato de cadena de texto
        this.timeStamp = new Date().toLocaleString();
    }
}

module.exports = HttpResponse