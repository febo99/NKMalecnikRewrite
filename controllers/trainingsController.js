import { userLogged } from '../utils/checkLogin';

module.exports = {
  trainings: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      res.render('trainings/trainings', {
        user: {
          email: req.session.email,
          role: req.session.role,
          id: req.session.userID,
          name: req.session.name,
          surname: req.session.surname,
        },
        error,
      });
    } else {
      res.redirect('/');
    }
  },

  getTraining: (req, res) => {
    const trainingID = req.body.id;
    res.render('trainings/training', {
      user: {
        email: req.session.email,
        role: req.session.role,
        id: req.session.userID,
        name: req.session.name,
        surname: req.session.surname,
      },
    });
  },

  newTrainingForm: (req, res) => {
    // locations, team is selected, saving attachments to filess
    if (userLogged(req)) {
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
          });
        });
      });
    } else {
      res.redirect('/');
    }
  },
};
