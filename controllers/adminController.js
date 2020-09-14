import bcrypt from 'bcrypt';

module.exports = {
  getPage: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const { error } = req.session;
      req.session.error = null;
      return res.locals.connection.query('SELECT * FROM users', async (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }

        res.render('admin/admin', {
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          users: rows,
          error,
        });
      });
    }
    res.redirect('/');
  },

  changePasswordPage: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      return res.locals.connection.query('SELECT email,ID FROM users WHERE ID = ?', req.params.id, async (err, data) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        const { error } = req.session;
        req.session.error = null;
        res.render('admin/changePasswordForm', {
          email: data[0].email,
          id: data[0].ID,
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
    }
    res.redirect('/');
  },

  changePassword: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const { password } = req.body;
      const saltRounds = 10;
      const userID = req.params.id;
      if (password.length < 8) {
        req.session.error = 'Prekratko geslo!';
        return res.redirect(`/admin/change-password/${userID}`);
      }
      bcrypt.hash(password, saltRounds, (hashErr, hash) => {
        res.locals.connection.query('UPDATE users SET password = ? WHERE ID = ?', [hash, userID], (err, result) => {
          if (err) {
            req.session.error = `Napaka pri spremembi gesla! Koda napake: ${err}`;
            return res.redirect(`/admin/change-password/${userID}`);
          }
          if (hashErr) {
            req.session.error = `Napaka pri spremembi gesla! Koda napake: ${hashErr}`;
            return res.redirect(`/admin/change-password/${userID}`);
          }
          if (result) {
            req.session.error = 'Uspesno spremenjeno geslo!';
            return res.redirect(`/admin/change-password/${userID}`);
          }
        });
      });
    } else {
      return res.redirect('/dashboard');
    }
  },

};
