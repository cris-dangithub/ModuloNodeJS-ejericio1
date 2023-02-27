const express = require('express');
const cors = require('cors');
const { usersRouter } = require('../routes/users.routes');
const { repairsRouter } = require('../routes/repairs.routes');
const { db } = require('../database/db');
const morgan = require('morgan');
const AppError = require('../utils/appError');
const { globalErrorHandler } = require('../controllers/error.controller');
const { initModel } = require('./init.model');
const { authRouter } = require('../routes/auth.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.paths = {
      users: '/api/v1/users',
      repairs: '/api/v1/repairs',
    };

    this.database();
    this.middlewares();
    this.routes();
  }

  database() {
    // ---- Autenticación de la base de datos ---- //
    db.authenticate()
      .then(res => console.log('Database authenticated'))
      .catch(err => console.log(err));
    // ---- Establecer modelos ---- //
    initModel();
    // ---- Sincronizar la base de datos ---- //
    db.sync()
      .then(res => console.log('Database synced'))
      .catch(err => console.log(err));
  }

  routes() {
    // Este endpoint me lleva a autorización y auntenticación relacionada a usuarios
    this.app.use(this.paths.users, authRouter);
    
    // Este endpoint lleva a lo relacionado con los usuarios
    this.app.use(this.paths.users, usersRouter);

    // Esta endpoint lleva a lo relacionado con las reparaciones
    this.app.use(this.paths.repairs, repairsRouter);
    // Este middleware es para errores relacionados a endpoints inexistentes
    this.app.use('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this Server!`, 404)
      );
    });
    // Este middleware permite centralizar los errores
    this.app.use(globalErrorHandler);
  }

  middlewares() {
    if (process.env.NODE_ENV === 'development') this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Puerto creado exitosamente en ${this.port}`);
    });
  }
}

module.exports = Server;
