const App = require("./App") //importando la clase App desde el archivo App

// creando una nueva instancia de la clase App llama al metodo listen() para iniciar el servidor
const start = () =>{
    const app = new App();
    // metodo encargado de iniciar el servidor de express
    app.listen();
}

start();