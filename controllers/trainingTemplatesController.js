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

  templatePage: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      const templateID = Number.parseInt(req.params.id, 10);
      res.locals.connection.query('SELECT * FROM trainingTemplates WHERE ID = ?', templateID, (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        return res.render('trainingTemplates/template', {
          template: rows[0],
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

  addTemplatePage: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      res.render('trainingTemplates/newTemplate', {
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

  newTemplate: (req, res) => {
    if (userLogged(req)) {
      const newTemplate = {
        id: null,
        title: req.body.title,
        intro: req.body.intro,
        main: req.body.main,
        end: req.body.end,
      };
      const { error } = req.session;
      req.session.error = null;
      res.locals.connection.query('INSERT INTO trainingTemplates VALUES ?', [[Object.values(newTemplate)]], (err) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        return res.redirect('/trainingTemplates');
      });
    } else {
      res.redirect('/');
    }
  },

};
