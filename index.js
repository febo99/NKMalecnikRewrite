import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import session from 'express-session';

// Routers imports
import indexRouter from './routes/index';
import userRouter from './routes/userRouter';
import dashboardRouter from './routes/dashboardRouter';
import playersRouter from './routes/playersRouter';
import teamsRouter from './routes/teamsRouter';
import settingsRouter from './routes/settingsRouter';
import matchesRouter from './routes/matchesRouter';
import payrollRouter from './routes/payrollRouter';
import presenceRouter from './routes/presenceRouter';
import trainingsRouter from './routes/trainingsRouter';
import calendarRouter from './routes/calendarRouter';

const app = express();
const port = 3000;

const logger = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });

dotenv.config(); // reads variables from .env

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(`${__dirname}/public`));

app.use(morgan('combined', { stream: logger }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

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

// Using routers
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/dashboard', dashboardRouter);
app.use('/players', playersRouter);
app.use('/teams', teamsRouter);
app.use('/settings', settingsRouter);
app.use('/matches', matchesRouter);
app.use('/presence-report', presenceRouter);
app.use('/payroll', payrollRouter);
app.use('/trainings', trainingsRouter);
app.use('/calendar', calendarRouter);

app.listen(port, () => {
  console.log(`Started a server at http://localhost:${port}`);
});
