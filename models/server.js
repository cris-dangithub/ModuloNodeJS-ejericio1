const { default: helmet } = require('helmet');
const { rateLimit } = require('express-rate-limit');
const cors = require('cors');
const express = require('express');
const hpp = require('hpp');
const morgan = require('morgan');
const xss = require('xss-clean');

const { authRouter } = require('../routes/auth.routes');
const { db } = require('../database/db');
const { globalErrorHandler } = require('../controllers/error.controller');
const { initModel } = require('./init.model');
const { repairsRouter } = require('../routes/repairs.routes');
const { usersRouter } = require('../routes/users.routes');
const AppError = require('../utils/appError');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.limiter = rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000,
      message: `Too many request from this IP`,
    });
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
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(hpp());
    if (process.env.NODE_ENV === 'development') this.app.use(morgan('dev'));
    this.app.use('/api/v1', this.limiter);
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
