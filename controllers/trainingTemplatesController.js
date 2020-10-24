import { userLogged } from '../utils/checkLogin';

module.exports = {
  templatesPage: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      res.locals.connection.query('SELECT * FROM trainingTemplates', (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        return res.render('trainingTemplates/trainingTemplates', {
          templates: rows,
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          error,
        });
      });
    } else {
      res.redirect('/');
    }
  },

};
