import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';

const path = require('path');

const app = express();
const port = 3000;

dotenv.config(); // reads variables from .env

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(`${__dirname}/public`));

// Database connection
app.use((req, res, next) => {
  res.locals.connection = mysql.createConnection({
    host: process.env.DATABASE_IP,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB_NAME,
  });
  res.locals.connection.connect();
  next();
});

// Routers definition
const indexRouter = require('./routes/index');

// Using routers
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Started a server at http://localhost:${port}`);
});
