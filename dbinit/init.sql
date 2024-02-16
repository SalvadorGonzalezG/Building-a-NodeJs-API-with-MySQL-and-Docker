
    -- Crear una DB y si no existe hay que llamarla patientsdb
CREATE DATABASE IF NOT EXISTS patientsdb;
    -- Usar la base de datos "patientsdb"
USE patientsdb;
    -- Eliminar la tabla "patients" si existe
DROP TABLE IF EXISTS patients;
    -- Crear una tabla llamada "patients"
CREATE TABLE patients
(
    -- Columna para el ID de tipo BIGINT sin signo que no puede ser nulo y se autoincrementa
	id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) DEFAULT NULL ,
    last_name VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    diagnosis VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(255) DEFAULT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	img_url VARCHAR(255) DEFAULT NULL,

    -- Definir la clave primaria de la columna "id"
    PRIMARY KEY (id),
    -- restriccion unica en la columna email que evitara la duplicidad de correos
    CONSTRAINT UQ_Patients_Email UNIQUE (email)
    -- Iniciar el valor de autoincremento para la columna "id" en 1.
) AUTO_INCREMENT = 1;