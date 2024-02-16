
    // Objeto Patient con varias propiedades las cuales son extraidas dl cuerpo de lasolicitud

    const Patient = [
    
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    req.body.address,
    req.body.diagnosis,
    req.body.phone,
    req.body.status,
    req.body.image_url
]
    // Exportamos el objeto para que pueda ser utilizado en otros archivos.
module.exports = Patient;