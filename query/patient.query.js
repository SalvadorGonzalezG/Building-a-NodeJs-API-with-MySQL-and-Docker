
//Objeto llamado QUERY, el cual contiene diferentes consultas SQL, utilizadas para interactuar con una tabla llamada patients en una DB.  
const QUERY = {
    //Selec todos los pacientes ordenados por fecha de creacion de forma DECENDENTE y limitar el resultado a 50 registros.
    SELECT_PATIENTS: 'SELECT * FROM patients ORDER BY created_at DESC LIMIT 50',
    //Selec todos los datos de un paciente especifico basado en su ID.
    SELECT_PATIENT: 'SELECT * FROM patients WHERE id = ?',
    CREATE_PATIENT: 'INSERT INTO patients (first_name, last_name, email, address, diagnosis, phone, status, image_url) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
    //Actualizar los datos de un paciente existente en la tabla de pacientes con los campos proporcionados, basado en su ID.
    UPDATE_PATIENT: 'UPDATE patients SET first_name = ?, last_name = ?, email = ?, address = ?, diagnosis = ?, phone = ?, status = ?, image_url = ? WHERE id = ?',
    //Eliminar un paciente de la tabla pacientes basado en su ID.
    DELETE_PATIENT: 'DELETE FROM patients WHERE id = ?'
};
