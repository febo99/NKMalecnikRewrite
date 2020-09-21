import moment from 'moment';
import { userLogged } from '../utils/checkLogin';
import Training from '../models/trainingModel';

module.exports = {
  trainings: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      res.locals.connection.query('SELECT * FROM trainings', (err, trainings) => {
        if (err) {
          req.session.error = { error: `Napaka pri pridobivanju treningov! Koda napake: ${err}` };
          res.redirect('/');
        }
        res.render('trainings/trainings', {
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          error,
          trainings,
        });
      });
    } else {
      res.redirect('/');
    }
  },

  getTraining: (req, res) => {
    const trainingID = Number.parseInt(req.params.id, 10);
    if (userLogged(req)) {
      res.locals.connection.query('SELECT * FROM trainings WHERE ID = ?', trainingID, (err, training) => {
        if (err) {
          req.session.error = { error: `Napaka pri pridobivanju treninga! Koda napake: ${err}` };
          return res.redirect('/trainings');
        }
        res.render('trainings/training', {
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          training: training[0],
        });
      });
    } else {
      res.redirect('/');
    }
  },

  newTrainingForm: (req, res) => {
    // locations, team is selected, saving attachments to filess
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      res.locals.connection.query('SELECT * FROM locations', (err, locations) => {
        if (err) {
          req.session.error = `Napaka pri pridobivanju lokacij! Koda napake ${err}`;
          return res.redirect('/trainings');
        }
        res.locals.connection.query('SELECT * FROM teams', (err1, teams) => {
          if (err1) {
            req.session.error = `Napaka pri pridobivanju ekip! Koda napake ${err1}`;
            return res.redirect('/trainings');
          }
          res.render('trainings/newTraining', {
            user: {
              email: req.session.email,
              role: req.session.role,
              id: req.session.userID,
              name: req.session.name,
              surname: req.session.surname,
            },
            locations,
            teams,
            error,
          });
        });
      });
    } else {
      res.redirect('/');
    }
  },

  addTraining: (req, res) => {
    if (userLogged(req)) {
      const { startTime } = req.body;
      const startTimeArray = startTime.split(':'); // split string to hours and minutes
      const duration = Number.parseInt(req.body.duration, 10);
      // set hours and minutes separately
      let startDatetime = new Date(req.body.date).setHours(Number(startTimeArray[0]));
      startDatetime = new Date(startDatetime).setMinutes(Number(startTimeArray[1]));
      // use moment to add minutes to date
      const endTime = moment(new Date(startDatetime)).add(duration, 'm').toDate();

      // Validate inputs
      const error = {};
      if (req.body.title === '' || !req.body.title) error.titleError = 'Prosim vnesi naslov treninga!';
      if (!req.body.date) error.dateError = 'Vnesen datum ni pravilen!';
      if (req.body.duration < 0) error.durationError = 'Trajanje more biti pozitivno stevilo!';
      else if (!req.body.duration) error.noDurationError = 'Prosim vnesi trajanje!';

      if (Object.keys(error).length !== 0) { // check if error object contains any keys
        req.session.error = error;
        return res.redirect('/trainings/new-training');
      }

      const newTraining = new Training(req.body.title, req.body.date, req.body.intro,
        req.body.main, req.body.end, req.body.report,
        req.body.location, startDatetime, endTime, null, req.body.team, req.session.userID);

      res.locals.connection.query('INSERT INTO trainings VALUES ?', [[newTraining.parseInsert()]], (err, training) => {
        if (err) {
          error.insertError = `Napaka pri vstavljanju! Koda napake ${err}`;
          req.session.error = error;
          return res.redirect('/trainings/new-training');
        }

        res.locals.connection.query('SELECT * FROM players WHERE teamID = ?', newTraining.teamID, (err1, players) => {
          if (err1) {
            error.error = `Napaka pri pridobivanju podatkov! Koda napake ${err1}`;
            req.session.error = error;
            return res.redirect('/trainings/new-training');
          }
          const presencePlayers = [];
          players.forEach((item) => {
            presencePlayers.push([null, 0, Number.parseInt(training.insertId, 10),
              Number.parseInt(item.ID, 10)]);
          });

          res.locals.connection.query('INSERT INTO presenceTrainings VALUES ?', [presencePlayers], (err2) => {
            if (err2) {
              error.insertError = `Napaka pri vstavljanju za prisotnost! Koda napake ${err2}`;
              req.session.error = error;
              return res.redirect('/trainings/new-training');
            }
            error.success = 'Trening uspesno vstavljen';
            req.session.error = error;
            return res.redirect(`/trainings/training/${training.insertId}`);
          });
        });
      });
    } else {
      res.redirect('/');
    }
  },

  deleteTraining: (req, res) => {
    const trainingID = Number.parseInt(req.params.id, 10);
    if (userLogged(req)) {
      const error = {};
      res.locals.connection.query('DELETE FROM trainings WHERE ID = ?', trainingID, (err) => {
        if (err) {
          error.error = `Brisanje ni bilo uspesno! Koda napake: ${trainingID}`;
          req.session.error = error;
          return res.redirect(`/trainings/training/${trainingID}`);
        }
        res.redirect('/trainings');
      });
    } else {
      res.redirect('/');
    }
  },
};
