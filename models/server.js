const express = require('express');
const cors = require('cors');
const { usersRouter } = require('../routes/users.routes');
const { repairsRouter } = require('../routes/repairs.routes');
const { db } = require('../database/db');
const morgan = require('morgan');

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
    db.authenticate()
      .then(res => console.log('Database authenticated'))
      .catch(err => console.log(err));
    db.sync()
      .then(res => console.log('Database synced'))
      .catch(err => console.log(err));
  }

  routes() {
    this.app.use(this.paths.users, usersRouter);
    this.app.use(this.paths.repairs, repairsRouter);
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
