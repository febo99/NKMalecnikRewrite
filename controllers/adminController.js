import bcrypt from 'bcrypt';

module.exports = {
  getPage: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const { error, success } = req.session;
      req.session.error = null;
      req.session.success = null;
      return res.locals.connection.query('SELECT * FROM users', async (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }

        res.render('admin/users', {
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          users: rows,
          error,
          success,
        });
      });
    }
    return res.redirect('/');
  },

  getPinRequests: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const { error } = req.session;
      req.session.error = null;
      const query = 'SELECT *, posts.ID AS postID FROM posts  INNER JOIN users ON posts.created = users.ID WHERE requestPin = 1';
      return res.locals.connection.query(query, (err, pinRequests) => {
        if (pinRequests) {
          pinRequests.forEach((item) => { // UTF -> slovenian locale format
            const orgDate = item.dateOfPost;
            // eslint-disable-next-line no-param-reassign
            item.dateOfPost = `${orgDate.getDate()}.${orgDate.getMonth() + 1}.${orgDate.getFullYear()} ${orgDate.getHours()}:${orgDate.getMinutes()}`;
          });
        }
        return res.render('admin/pinnedPostRequests', {
          error,
          pinRequests,
          err,
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
        });
      });
    }
    return res.redirect('/');
  },

  changePasswordPage: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      return res.locals.connection.query('SELECT email,ID FROM users WHERE ID = ?', req.params.id, async (err, data) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        const { error, success } = req.session;
        req.session.error = null;
        req.session.success = null;
        return res.render('admin/changePasswordForm', {
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
          success,
        });
      });
    }
    return res.redirect('/');
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
      return bcrypt.hash(password, saltRounds, (hashErr, hash) => {
        res.locals.connection.query('UPDATE users SET password = ? WHERE ID = ?', [hash, userID], (err) => {
          if (err) {
            req.session.error = `Napaka pri spremembi gesla! Koda napake: ${err}`;
            return res.redirect(`/admin/change-password/${userID}`);
          }
          if (hashErr) {
            req.session.error = `Napaka pri spremembi gesla! Koda napake: ${hashErr}`;
            return res.redirect(`/admin/change-password/${userID}`);
          }
          req.session.error = 'Uspesno spremenjeno geslo!';
          return res.redirect(`/admin/change-password/${userID}`);
        });
      });
    }
    return res.redirect('/dashboard');
  },

  decidePin: (req, res) => {
    const operation = req.body.accept || req.body.cancel;
    const postID = req.params.id;
    if (operation.toLowerCase() === 'sprejmi') {
      return res.locals.connection.query('UPDATE posts SET requestPin = 0, pinned = 1 WHERE ID = ?', postID, (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri zahtevku za pripenjanje objave! Koda napake ${err}`;
          return res.redirect('admin/pin-requests');
        }
        req.session.success = 'Pripenjanje uspesno!';
        return res.redirect('admin/pin-requests');
      });
    } if (operation.toLowerCase() === 'zavrni') {
      return res.locals.connection.query('UPDATE posts SET requestPin = 0, pinned = 0 WHERE ID = ?', postID, (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri zahtevku za pripenjanje objave! Koda napake ${err}`;
          return res.redirect('admin/pin-requests');
        }
        req.session.success = 'Preklic uspesen!';
        return res.redirect('admin/pin-requests');
      });
    }
    return res.redirect('/');
  },

};
