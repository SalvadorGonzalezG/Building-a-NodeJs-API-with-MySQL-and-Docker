const { Request, Response, query } = require("express")
const { v4:uuidv4 } = require("uuid") //importa la v4 de la paqueteria uuid para generar uuids de forma dinamica 
const Patient = require("../interface/patient")
const connection = require("../config/mysql.config")
const QUERY = require("../query/patient.query")
const Code = require("../enum/code.enum")
const HttpResponse = require("../domain/response")
const Status = require("../enum/status.enum")
const mysql2 = require("mysql2/promise")
const { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } = require("mysql2/promise")

//   CRUD que interactuara con una base de datos de pacientes atravez de una API HTTP


// Funcion asincrona maneja solicitudes para recuperar todos los pacientes.
const getPatients = async (req, res) => {
    try {
        // Establece una conexion a una DB utilizando la f:connection() se espera que devuelva una promesa
        const pool = await connection();
        // Definimos la consulta SQL para recuperar todos los pacientes de la DB ordenados por fecha de creacion y de forma decendento limitadoa 50 registros.
        const query = 'SELECT * FROM patients ORDER BY created_at DESC LIMIT 50'
        // Realiza una consulta a la DB para recuperar pacientes utilizando la consulta definida anteriormente , espera el resultado de la consulta y lo asigna a la variable 'allPatients'
        const [allPatients] = await pool.query(query);
        // Comprueba si se encontraron pacientes en la Db.
        if(allPatients.length>0){
        // Si se encontraron pacientes, devuelve una respuesta exitosa con un msj y los pacientes recuperados.
            return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, "PACIENTES RECUPERADOS CON EXITO", allPatients))
        } else {
        // Si no se encontraron pacientes, devuelve un msj que dice que no se encontraron pacientes.
            return res.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, "No se econtraron pacientes"))
        } 
        // maneja cualquier error que ocurra en el proceso anterior.
    } catch (error) {
        console.error(error);
        //devuelve una respuesta al cliente con un estado HTTP500 
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'A ocurrido un error'));
    }
};

// f: asincrona que maneja solicitudes para recuperar informacion sobre un paciente especifico.
// Definimos una funcion asincrona para recuperar un paciente por su id de la base de datos de mysql
const getPatient = async(req, res) => {
    // codigo envuelto en un bloque try-catch para el manejo de errores
    try {
    // Se conecta a la DB.
    const pool = await connection();
    // Obtiene el id del paciente de los parametros de la solicitud
    const patientId = req.params.patientId;
    // consultamos MySQL para obtener informacion del paciente con el ID proporcionado.
    const query = `SELECT * FROM patients WHERE id = ?`;
    // Ejecutamos la consulta y almacenamos los resultado en la variable result.
   const [result] = await pool.query(query, [patientId]);
        if (result.length>0){
    // Si se encontraron resultados, devuelve una respuesta exitosa con un msj y el paciente que se recupero.
            return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Paciente Recuperado de DB', result))
        } else {
    // Si no se encontraron resultados devuelve un msj de no encontrado
            return res.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'));
        }
    }catch (error) {
        // Si ocurre un error durante la ejecucion de la funcion, maneja el error y devuelve un msj del error interno del servidor.
        console.error(error)
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'A ocurrido un error'));
    }
} 

    // funcion asincrona para crear un nuevo paciente en la DB.
const createPatient = async (req, res) => {
    // Codigo envuelto en un bloque try-catch para el manejo de erres, si ocurre un error dentro del bloque try, se captura y se maneja en el bloque catch.
    try {
    // Se extraen los datos del paciente de la solicitud HTTP. se asume que los datos del paciente estan incluidos en el cuerpo de la solicitud 'req.body'.
     const patientData = req.body;
    // Se establece la conexion con la base de datos. la f: connection es llamada de forma asincrona
    const pool = await connection();
    
    // Se define una Consulta a la DB para insertar un nuevo paciente a la tabla "patients"
    const query = 'INSERT INTO patients (first_name, last_name, email, address, diagnosis, phone, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    
    // Ejecucion de la consulta SQL usando pool(conexiones a la db), los valores para la consulta se pasan como un array en el segundo argumento de pool.query()
    // el resultado de la consulta se almacena el 'result'
    const [result] = await pool.query( query,
        [   
            patientData.first_name,
            patientData.last_name,
            patientData.email,
            patientData.address,
            patientData.diagnosis,
            patientData.phone,
            patientData.status,
            patientData.image_url
        
])
    // Se obtiene el ID del paciente recien creado.
  const patientId = result.insertId;

    console.log(`el paciente ${patientData.first_name} con ID: ${patientId} a sido creado Exitosamente.`)
    // respuesta al cliente indicando que el paciente fue creado exitosamente.
return res.status(Code.CREATED).send( new HttpResponse(Code.CREATED, Status.CREATED, 'PACIENTE CREADO EXITOSAMENTE.', patientId));
    // Manejo de errores: registro del error en la consola y respuesta al cliente con un msj de error.
} catch(error){
    console.error(error)
    return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'A ocurrido un error'))
    }
}
    

// Definimos una f: llamada updatePatient que maneja solicitudes para actualizar informacion sobre un paciente.
const updatePatient = async (req = Request, res = Response) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)
    let patient = { ...req.body }
    try {
        const pool = await connection();
        const [result] = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId]);
        // verifica si se a encontrado ulmenos un paciente en DB si se encuentra alguno se procede con la actualizacion
        if (result.length > 0) {
            const [updateResult] = await pool.query(QUERY.UPDATE_PATIENT, [...Object.values(patient), req.params.patientId])
            return res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Patient update', { ...patien, id: req.params.patientId }));
        } else {
            return res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'));
        }

    } catch (error) {
        console.error(error);
        return res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'A ocurrido un error'));
    }
};

// f: que maneja una solicitud para eliminar un paciente 
const deletePatient = async (req = Request, res = Response) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)
    try {
        const pool = await connection();
        // ejecuta una consulta  SQL para seleccionar un paciente especifico utilizando el ID del paciente proporcionado en los parametros de la solicitud
        const result = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId]);
        if (result[0].length > 0) {
            const result = await pool.query(QUERY.DELETE_PATIENT, [req.params.patientId])
            // si el paciente se elimina correctamente, se envia una respuesta con un estado HTTP 200 y un msj indicando que el paciente se a eliminado con exito
            return res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Patient deleted'));
        } else {
            return res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'));
        }

    } catch (error) {
        console.error(error);
        return res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'A ocurrido un error'));
    }
};


module.exports = {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient
}