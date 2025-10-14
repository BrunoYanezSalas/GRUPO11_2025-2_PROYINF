const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS: permitir conexión desde React
app.use(cors({
  origin: 'http://localhost:3001', // aquí pones la URL de tu frontend
  credentials: true
}));

// Middleware JSON
app.use(express.json());

// Conexión a base de datos
const db = require('./models');

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/ensayos', require('./routes/ensayos'));
app.use('/api/preguntas', require('./routes/preguntas'));
app.use('/api/respuestas', require('./routes/respuestas'));
app.use('/api/resultados', require('./routes/resultados'));

// Ruta base para test
app.get('/', (req, res) => {
  res.send('Servidor funcionando para ensayos PAES 🧠');
});

// Sincronizar con base de datos y lanzar servidor
db.sequelize.sync().then(() => {
// LÍNEA CORRECTA
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
}).catch(err => {
  console.error('❌ Error al conectar con la base de datos:', err);
});
