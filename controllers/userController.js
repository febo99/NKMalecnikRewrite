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
      return res.json({ data: rows[0] });
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
};
