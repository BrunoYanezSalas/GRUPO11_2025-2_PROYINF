module.exports = (sequelize, DataTypes) => {
  const Ensayo = sequelize.define("Ensayo", {
    titulo: DataTypes.STRING,
    fecha: DataTypes.DATE,
    materia: DataTypes.STRING,
    docenteId: DataTypes.INTEGER
  });
  return Ensayo;
};
