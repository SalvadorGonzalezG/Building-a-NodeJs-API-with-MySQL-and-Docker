const express = require("express");
const ip = require("ip")
const cors = require("cors")

//La clase App tiene un constructor que inicializa la aplicacion de express
// y luego llama a los metodos middleware y routes.

class App {
    // PROPIEDADES DE CLASE (APLICATION RUNNING & ROUTE_NOT_FOUND)
  APLICATION_RUNNING= 'Application is running on:';
  ROUTE_NOT_FOUND = 'Route does not exist on the server';
  constructor(port = process.env.SERVER_PORT || 3000 ){
    this.port = port;
    this.app = express();
    this._middleware();
    this.routes();
  }
  // metodo de la clase App que utiliza el metodo listen() de la instancia de la aplicacion de express(this.app) para iiciar el puerto especificado (this.port)
  listen() {
    this.app.listen(this.port)
    console.info(`${this.APLICATION_RUNNING} ${ip.address()}:${this.port}`)
  }
  // metodo llamado en la inicializacion de la aplicacion de express
  // utiliza el middleware 'cors' que permitiran todas las solicitudes desde cuaquier origen
    _middleware(){
        this.app.use(cors({ origin: '*'}));
        // analiza el cuerpo de las solicitudes entrantes con json
        this.app.use(express.json());
  }
  // metodo que define las rutas para la aplicacion de express
  routes(){
    this.app.use('/patients', (req,res) => {});
    // manejador de solicitud GET para la ruta raiz('/') que devuelve un msj con un estado HTTP 200
    this.app.get('/', (req, res) => res.status(200).send({ message: 'Server is on'}))
    // Maneja todas las solicitudes a cualquier otra ruta que no este definida anteriormente, en ete caso devuelve un msh indicando que la ruta no se encontro status(404) con un msj definido en la propiedad 'ROUTE_NOT_FOUND' de la instancia de la clase.
    this.app.all('*', (req, res) => res.status(404).send({ message: this.ROUTE_NOT_FOUND }));
  }
}

module.exports = App;