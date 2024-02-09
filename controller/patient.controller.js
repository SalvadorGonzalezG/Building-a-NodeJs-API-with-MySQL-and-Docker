const { Request, Response } = require("express")
const Patient = require("../interface/patient")
const connection = require("../config/mysql.config")
const QUERY = require("../query/patient.query")
const Code = require("../enum/code.enum")
const HttpResponse = require("../domain/response")
const Status = require("../enum/status.enum")
const mysql2 = require("mysql2/promise")
const { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } = require("mysql2/promise")

//   CRUD que interactuara con una base de datos de pacientes atravez de una API HTTP


// Funcion asincrona maneja solicitudes para recuperar pacientes.
const getPatients = async (req = Request, res = Response) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)
    try {
        // establece una conexion a una DB utilizando la f:connection() se espera que devuelva una promesa
        const pool = await connection();
        // Realiza una consulta a la DB para recuperar pacientes utilizando una consulta almacenada la constante QUERY.SELECT_PATIENTS, espera el resultado de la consulta y lo asigna a la variable 'result'
        const [result] = await pool.query(QUERY.SELECT_PATIENTS);
        return res.status(Code.OK)
            .send(new HttpResponse(Code.OK, Status.OK, 'Patients retrieved', result));
        // maneja cualquier error que ocurra en el proceso anterior.
    } catch (error) {
        console.error(error);
        //devuelve una respuesta al cliente con un estado HTTP500 
        return res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'A ocurrido un error'));
    }
};

// f: asincrona que maneja solicitudes para recuperar informacion sobre un paciente especifico.
const getPatient = async (req = Request, res = Response) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)
    try {
        const pool = await connection();
        //Realiza una consulta a DB para recuperar info sobre un paciente especifico
        const [result] = await pool.query(QUERY.CREATE_PATIENT, [req.params.patientId]);
        // Verifica si se a encontrado algun paciente a la base de datos si result.length >0 significa que a encontrado almenos un paciente.
        if (result.length > 0) {
            // si a encontrado un paciente devuelve un status200 y los detalles del paciente en el cuerpo de la respuesta.
            return res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Patient retrieved', result[0]));
        } else {
            // De lo contrario devuelve una respuesta con un estado HTTP 404.
            return res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'));
        }
        // Maneja cualquier error que ocurra durant el proceso anterior. 
    } catch (error) {
        console.error(error);
        return res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'A ocurrido un error'));
    }
};

    // funcion asincrona para crear un nuevo paciente en la DB.

    /*const createPatient = async (patientData, res) => {
    try {
    // Conexion con la base de datos.
    const pool = await connection();
    // Consulta a la DB para insertar un nuevo paciente a la tabla "patients"
    const mysql2 = 'INSERT INTO patients (first_name, last_name, email, address, diagnosis, phone, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    // Ejecucion de la consulta con los datos proporcionados del paciente.
    const [result] = await pool.query(mysql2, [
            patientData.first_name,
            patientData.last_name,
            patientData.email,
            patientData.address,
            patientData.diagnosis,
            patientData.phone,
            patientData.status,
            patientData.image_url
        ]);
    // Obtencion del ID del paciente recin creado.
    const patientId = result.insertId

    console.log(`el paciente con id:${patientId} a sido creado`)
    
    // respuesta al cliente indicando que el paciente fue creado exitosamente.
    return res.status(Code.CREATED).send(new HttpResponse(Code.CREATED, Status.CREATED, 'Patient created', patientId)); 
        
} catch(error) {
    // Manejo de errores: registro del error en la consola y respuesta al cliente con un msj de error.
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'Ha ocurrido un error'));

    }
}*/
const createPatient = async (req, res) => {
    try {
     const patientData = req.body;
    
    // Conexion con la base de datos.
    const pool = await connection();
    // Consulta a la DB para insertar un nuevo paciente a la tabla "patients"
    const query = 'INSERT INTO patients (first_name, last_name, email, address, diagnosis, phone, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    // Ejecucion de la consulta con los datos proporcionados del paciente.
    
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
    // Obtencion del ID del paciente recien creado.
const Id = result.patientId;
    console.log(`el paciente con ID: ${Id} a sido creado Exitosamente.`)
    // respuesta al cliente indicando que el paciente fue creado exitosamente.
return res.status(Code.CREATED).send( new HttpResponse(Code.CREATED, Status.CREATED, 'PACIENTE CREADO EXITOSAMENTE.', Id));
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