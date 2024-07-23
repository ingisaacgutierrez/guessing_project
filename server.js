const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Rutas de usuario
app.use('/users', userRoutes);

// Rutas de administrador
app.use('/admins', adminRoutes);

// Configuración de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});

