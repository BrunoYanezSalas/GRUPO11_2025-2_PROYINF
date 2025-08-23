module.exports = (sequelize, DataTypes) => {
  const Respuesta = sequelize.define("Respuesta", {
    ensayoId: DataTypes.INTEGER,
    preguntaId: DataTypes.INTEGER,
    usuarioId: DataTypes.INTEGER,
    seleccionada: DataTypes.STRING,
    correcta: DataTypes.BOOLEAN
  });
  return Respuesta;
};
