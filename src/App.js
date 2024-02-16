const express = require("express");
const ip = require("ip")
const cors = require("cors")
const HttpResponse = require("./domain/response")
const Code = require("./enum/code.enum")
const Status = require("./enum/status.enum") 
const patientRoutes = require("./routes/patient.routes")
//const connection = require("./config/mysql.config")
//La clase App tiene un constructor que inicializa la aplicacion de express
// y luego llama a los metodos middleware y routes.

class App {
    // PROPIEDADES DE CLASE (APLICATION RUNNING & ROUTE_NOT_FOUND)
  constructor(port = process.env.SERVER_PORT || 3000 ){
    this.port = port;
    this.app = express();
    this.ROUTE_NOT_FOUND = 'Route does not exist on the server';
    this.middleware();
    this.routes();
    //this.ip = ip.address();
  }
  // metodo de la clase App que utiliza el metodo listen() de la instancia de la aplicacion de express(this.app) para iiciar el puerto especificado (this.port)
  listen() {
    this.app.listen(this.port)
    console.info(`Application is running on: ${ip.address()}:${this.port}`)
  }
  // metodo llamado en la inicializacion de la aplicacion de express
  // utiliza el middleware 'cors' que permitiran todas las solicitudes desde cuaquier origen
    middleware(){
        this.app.use(cors({ origin: '*' }));
        // analiza el cuerpo de las solicitudes entrantes con json
        this.app.use(express.json());
  }
  // metodo que define las rutas para la aplicacion de express
  routes(){
    // si la app esta alojada en /patients se debe de enrutar el manejo de estas solicitudes al objeto patientRoutes.
    this.app.use('/patients', patientRoutes);
    // manejador de solicitud GET para la ruta raiz('/') que devuelve un msj con un estado HTTP 200
    this.app.get('/', (_, res) => res.status(Code.OK).send( new HttpResponse(Code.OK, Status.OK, 'Welcome to the patients API V.1')))
    // Maneja todas las solicitudes a cualquier otra ruta que no este definida anteriormente, en ete caso devuelve un msh indicando que la ruta no se encontro status(404) con un msj definido en la propiedad 'ROUTE_NOT_FOUND' de la instancia de la clase.
    this.app.all('*', (_, res) => res.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, this.ROUTE_NOT_FOUND)));
  }
}

module.exports = App;