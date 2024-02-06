
    // Objeto de js que mapea los nombres de los estados a sus valores correspondientes como una cadena de texto
const Status = {
    OK: 'OK',
    NOT_FOUND: 'NOT_FOUND',
    CREATED: 'CREATED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};
    // metodo de js que se utiliza para que el objeto sea inmutable, no se puede agregar, eliminar o modificar propiedades existentes en el objeto.
Object.freeze(Status);
module.exports = Status