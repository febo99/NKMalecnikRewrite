import moment from 'moment';
import { userLogged, isUserAdminOrHOYD } from '../utils/checkLogin';
import Training from '../models/trainingModel';
import { htmlInputFormatDate } from '../utils/formatDate';

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
    const firstAdd = req.session.added ? 'show' : 'hide';
    req.session.added = null;
    if (userLogged(req)) {
      res.locals.connection.query('SELECT * FROM trainings WHERE ID = ?', trainingID, (err, training) => {
        if (err) {
          req.session.error = { error: `Napaka pri pridobivanju treninga! Koda napake: ${err}` };
          return res.redirect('/trainings');
        }
        const query = `SELECT *, presenceTrainings.ID AS presenceID FROM presenceTrainings INNER JOIN players 
        ON presenceTrainings.playerID = players.ID WHERE trainingID = ?`;
        res.locals.connection.query(query, trainingID, (err1, presence) => {
          if (err1) {
            req.session.error = { error: `Napaka pri pridobivanju prisotnosti! Koda napake: ${err1}` };
            return res.redirect('/trainings');
          }

          const returnTraining = training[0];
          if (training[0].attachment !== null) {
            returnTraining.attachment = training[0].attachment.split(',');
          }

          res.render('trainings/training', {
            user: {
              email: req.session.email,
              role: req.session.role,
              id: req.session.userID,
              name: req.session.name,
              surname: req.session.surname,
            },
            training: returnTraining,
            presence,
            firstAdd,
          });
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

  editTrainingForm: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      const trainingID = req.params.id;
      res.locals.connection.query('SELECT * FROM locations', (err, locations) => {
        if (err) {
          req.session.error = `Napaka pri pridobivanju lokacij! Koda napake ${err}`;
          return res.redirect(`/trainings/training/${trainingID}`);
        }
        res.locals.connection.query('SELECT * FROM teams', (err1, teams) => {
          if (err1) {
            req.session.error = `Napaka pri pridobivanju ekip! Koda napake ${err1}`;
            return res.redirect(`/trainings/training/${trainingID}`);
          }
          res.locals.connection.query('SELECT * FROM trainings WHERE ID = ?', trainingID, (err2, training) => {
            if (err2) {
              req.session.error = `Napaka pri pridobivanju ekip! Koda napake ${err1}`;
              return res.redirect(`/trainings/training/${trainingID}`);
            }

            if (training[0].created !== req.session.userID) { // if user isnt creator
              if (!isUserAdminOrHOYD(req)) { // if user isnt admin or hoyd
                req.session.error = 'Nimas pravic za ogled vsebine';
                return res.redirect(`/trainings/training/${trainingID}`);
              }
            }

            const editTraining = training[0];
            const startTime = moment(editTraining.startTime);
            const endTime = moment(editTraining.endTime);

            if (training[0].attachment !== null) {
              editTraining.attachment = training[0].attachment.split(',');
            }

            // format data from db to HTML format
            editTraining.dateOfTraining = htmlInputFormatDate(editTraining.dateOfTraining);
            editTraining.startTime = moment(editTraining.startTime).format('hh:mm');
            editTraining.duration = endTime.diff(startTime, 'minutes');

            res.render('trainings/editTraining', {
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
              training: editTraining,
            });
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
      console.log(req.files);
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

      // Parsing files, saving to uploads/ and to db
      let attachments = [];
      if (req.files) {
        req.files.forEach((item) => {
          const file = item.originalname.replace(' ', '_').replace(',', '_');

          const extension = file.split('.').pop();
          if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg' && extension !== 'gif' && extension !== 'svg' && extension !== 'pdf') {
            error.extensionError = 'Dovoljene so samo datoteke .png, .jpg, .jpeg, .gif, .svg in .pdf!';
            req.session.error = error;
            return res.redirect('/trainings/new-training');
          }

          attachments.push(file);
        });
      }
      if (attachments.length === 0) attachments = null;
      else attachments = attachments.join();

      const newTraining = new Training(req.body.title, req.body.date, req.body.intro,
        req.body.main, req.body.end, req.body.report,
        req.body.location, startDatetime, endTime, attachments,
        req.body.team, req.session.userID);

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
          if (players.length === 0) {
            error.insertError = 'Ekipa nima vnesenih igralcev! Dodaj igralce v ekipo!';
            req.session.error = error;
            return res.redirect('/trainings/new-training');
          }
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
            req.session.added = true;
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

  editTraining: (req, res) => {
    if (userLogged(req)) {
      const trainingID = req.params.id;
      const { startTime } = req.body;
      const startTimeArray = startTime.split(':'); // split string to hours and minutes
      const duration = Number.parseInt(req.body.duration, 10);
      // set hours and minutes separately
      let startDatetime = new Date(req.body.date).setHours(Number(startTimeArray[0]));
      startDatetime = new Date(startDatetime).setMinutes(Number(startTimeArray[1]));
      // use moment to add minutes to date
      const endTime = moment(new Date(startDatetime)).add(duration, 'm').toDate();
      const error = {};

      let attachments = [];
      if (req.files) {
        req.files.forEach((item) => {
          const file = item.originalname.replace(' ', '_').replace(',', '_');
          const extension = file.split('.').pop();

          if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg' && extension !== 'gif' && extension !== 'svg' && extension !== 'pdf') {
            error.extensionError = 'Dovoljene so samo datoteke .png, .jpg, .jpeg, .gif, .svg in .pdf!';
            req.session.error = error;
            return res.redirect(`/trainings/edit-training/${trainingID}`);
          }
          attachments.push(file);
        });
      }

      if (attachments.length === 0) attachments = null;
      else attachments = attachments.join();
      // Validate inputs

      if (req.body.title === '' || !req.body.title) error.titleError = 'Prosim vnesi naslov treninga!';
      if (!req.body.date) error.dateError = 'Vnesen datum ni pravilen!';
      if (req.body.duration < 0) error.durationError = 'Trajanje more biti pozitivno stevilo!';
      else if (!req.body.duration) error.noDurationError = 'Prosim vnesi trajanje!';

      if (Object.keys(error).length !== 0) { // check if error object contains any keys
        req.session.error = error;
        return res.redirect(`/trainings/edit-training/${trainingID}`);
      }

      const newTraining = new Training(req.body.title, req.body.date, req.body.intro,
        req.body.main, req.body.end, req.body.report,
        req.body.location, startDatetime, endTime, attachments, req.body.team, req.session.userID);

      const editTraining = newTraining.parseInsert();

      editTraining.splice(0, 1); // remove ID field
      editTraining[editTraining.length - 1] = trainingID;

      const editQuery = `UPDATE trainings SET title = ?, dateOfTraining = ?, intro = ?, main = ?,
       end = ?, report = ?, locationID = ?, startTime = ?, endTime = ?, attachment = ?, teamID = ?
       WHERE ID = ?`;

      res.locals.connection.query(editQuery, editTraining, (err) => {
        if (err) {
          error.insertError = `Napaka pri urejanju! Koda napake ${err}`;
          req.session.error = error;
          return res.redirect(`/trainings/edit-training/${trainingID}`);
        }

        error.success = 'Trening uspesno urejen';
        req.session.error = error;
        return res.redirect(`/trainings/training/${trainingID}`);
      });
    } else {
      res.redirect('/');
    }
  },
};
