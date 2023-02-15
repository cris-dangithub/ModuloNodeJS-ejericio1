require('dotenv').config();

const Server = require('./models/server')

const server = new Server()

server.listen()

// todo ------------------------------
/*
  1) Manejo de errores
    *1. Revisar y comparar el manejo de errores con los otros proyectos
    2. Revisar errores falsos
  

*/