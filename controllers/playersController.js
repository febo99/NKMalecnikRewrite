module.exports = {
  getAllPlayers: (req, res) => {
    if (req.session.email) {
      res.locals.connection.query('SELECT * FROM players', (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        return res.render('players/players', { players: rows });
      });
    }
  },

  getMyPlayers: (req, res) => {
    if (req.session.email) {
      const { userID } = req.session;
      res.locals.connection.query('SELECT * FROM players WHERE created = ?', [userID], (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        return res.render('players/myPlayers', { players: rows });
      });
    } else {
      res.redirect('/');
    }
  },
};
