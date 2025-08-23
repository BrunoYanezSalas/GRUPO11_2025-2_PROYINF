module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define("Usuario", {
    nombre: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    rol: DataTypes.STRING // estudiante, docente, visualizador, admin
  });
  return Usuario;
};
