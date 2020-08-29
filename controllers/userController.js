module.exports = {
  login: (req, res) => {
    res.locals.connection.query('SELECT * FROM users WHERE email=? AND password=?', [req.body.email, req.body.password], (err, rows) => {
      if (err) {
        res.json({ error: err });
        throw err;
      }
      if (rows.length === 0) {
        return res.json({ error: 'Wrong username or password!' });
      }
      const { email } = rows[0];
      const { role } = rows[0];
      const { userID } = rows[0].ID;
      req.session.email = email;
      req.session.role = role;
      req.session.userID = userID;
      return res.redirect('/dashboard');
    });
  },
  getAllUsers: (req, res) => {
    res.locals.connection.query('SELECT * FROM users', (err, rows) => {
      if (err) {
        res.json({ error: err });
        throw err;
      }
      return res.json({ data: rows });
    });
  },

  logout: (req, res) => {
    if (req.session.email) {
      req.session.destroy();
      return res.json({ message: 'Uspesno!' });
    }
    return res.json({ error: 'Nisi prijavljen' });
  },
};
