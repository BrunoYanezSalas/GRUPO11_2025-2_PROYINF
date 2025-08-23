module.exports = (sequelize, DataTypes) => {
  const Pregunta = sequelize.define("Pregunta", {
    enunciado: DataTypes.STRING,
    ensayoId: DataTypes.INTEGER,
    alternativas: DataTypes.JSON, // { a: '...', b: '...', c: '...' }
    correcta: DataTypes.STRING
  });
  return Pregunta;
};
