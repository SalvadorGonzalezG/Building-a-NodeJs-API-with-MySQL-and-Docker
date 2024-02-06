
    // Objeto que mapea nombres de codigo de estado a sus valores correspondientes
const Code = {
    OK : 200,
    NOT_FOUND : 404,
    BAD_REQUEST : 400,
    CREATED : 201,
    INTERNAL_SERVER_ERROR : 500
}

    //Objet.freeze() lo utilizamos para evitar modificaciones en el codigo, es decir sea inmutable.
Object.freeze(Code);

module.exports = Code
