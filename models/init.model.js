const Repairs = require('./repairs.model');
const Users = require('./users.model');

exports.initModel = () => {
  // Users --- Repairs
  /*
    Un usuario puede tener muchas reparaciones, pero esas reparaciones
    pertenecen a un solo usuario.
  */
  Users.hasMany(Repairs);
  Repairs.belongsTo(Users);
};
