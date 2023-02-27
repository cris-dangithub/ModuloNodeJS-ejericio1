require('dotenv').config();

const Server = require('./models/server');

const server = new Server();

server.listen();

// todo ------------------------------
/*
  1) Manejo de errores
    *1. Revisar y comparar el manejo de errores con los otros proyectos
    *2. Revisar errores falsos
  2) Autenticación
    *1. Instalación de librerías -> jsonwebtoken, bcryptjs
    2. Cambiar la creación de un usuario
    3. 
    4. Hacer un login
    5.

*/
