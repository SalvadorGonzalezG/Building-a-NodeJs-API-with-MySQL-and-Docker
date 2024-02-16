const Router = require("express")
const { getPatients, getPatient, createPatient, updatePatient, deletePatient } = require('../controller/patient.controller')

    // Creando una nueva intancia del objeto Router 
const patientRoutes = Router();
    // para la ruta raiz se manejan las operaciones GET
patientRoutes.route('/')
    // Obtener todos los pacientes
    .get(getPatients)
    // Crear un nuevo paciente.
    .post(createPatient)

patientRoutes.route('/:patientId')
    // Obtener un paciente por su ID
    .get(getPatient)
    // Actualizar un paciente existente
    .put(updatePatient)
    // Eliminar un pacinete existente
    .delete(deletePatient);

module.exports = patientRoutes;