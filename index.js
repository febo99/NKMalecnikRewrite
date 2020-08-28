import express from 'express';

const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(`${__dirname}/public`));

// Routers definition
const indexRouter = require('./routes/index');

// Using routers
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Started a server at http://localhost:${port}`);
});
