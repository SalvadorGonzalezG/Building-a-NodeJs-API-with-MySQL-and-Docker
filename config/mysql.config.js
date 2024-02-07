
    // permite utilizar esta funcion para crear un grupo de conexiones a una base de datos MySQL utilizando promesas en lugar de devoluciones de llamada mejora la legibilidad y la facilidad de uso en codigo asincrono en entornos Node.js
    const { createPool } = require("mysql2/promise");
    //Es una libreria que permite cargar variables de entorno desde un archivo ".env" en Node.Js
    const dotenv = require("dotenv");

    // Carga las variables de entorno definidas en un archivo .env
    dotenv.config();
    // f: llamada connection f: asincrona devuelve una promesa establece una conexion a la DB MySQL
    const connection = async () => {
    // crea un grupoo de conexiones a la DB MySQL utilizando las variables de entorno cargadas desde el archivo .env
        const pool = await createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: 3306 || process.env.DB_PORT,
            connectionLimit: 10 || process.env.DB_CONNECTION_LIMIT
        })
        // La funcion devuelve el grupo de conexiones para que pueda ser utilizado en otras partes de la aplicacion para realizar consultas a la DB.
        return pool
    }
    module.exports = connection

