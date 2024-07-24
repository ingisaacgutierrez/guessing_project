// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express();

// Configurar CORS
const corsOptions = {
  origin: 'https://guessinggameplatform.netlify.app/',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

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


