const { Sequelize, DataTypes } = require('sequelize');

// Conexión a la base de datos
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'postgres_db',
  dialect: 'postgres',
  logging: false,
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Cargar modelos
db.Usuario = require('./usuario')(sequelize, DataTypes);
db.Ensayo = require('./ensayo')(sequelize, DataTypes);
db.Pregunta = require('./pregunta')(sequelize, DataTypes);
db.Respuesta = require('./respuesta')(sequelize, DataTypes);

// RELACIONES ENTRE MODELOS
db.Usuario.hasMany(db.Ensayo, { foreignKey: 'docenteId' });
db.Ensayo.belongsTo(db.Usuario, { as: 'docente', foreignKey: 'docenteId' });

db.Ensayo.hasMany(db.Pregunta, { foreignKey: 'ensayoId' });
db.Pregunta.belongsTo(db.Ensayo, { foreignKey: 'ensayoId' });

db.Usuario.hasMany(db.Respuesta, { foreignKey: 'usuarioId' });
db.Respuesta.belongsTo(db.Usuario, { foreignKey: 'usuarioId' });

db.Ensayo.hasMany(db.Respuesta, { foreignKey: 'ensayoId' });
db.Respuesta.belongsTo(db.Ensayo, { foreignKey: 'ensayoId' });

db.Pregunta.hasMany(db.Respuesta, { foreignKey: 'preguntaId' });
db.Respuesta.belongsTo(db.Pregunta, { foreignKey: 'preguntaId' });

module.exports = db;
