const express = require('express');

//La clase App tiene un constructor que inicializa la aplicacion de express
// y luego llama a los metodos middleware y routes.

class App {
  constructor(port = process.env.SERVER_PORT || 3000 ){
    this.port = port;
    this.app = express();
    this.middleware();
    this.routes();
  }
}
module.exports = App;