module.exports = {
  getAllPlayers: (req, res) => {
    if (req.session.email) {
      res.locals.connection.query('SELECT * FROM players', (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        rows.forEach((row) => {
          const player = row;
          const date = new Date(row.dateOfBirth);
          player.dateOfBirth = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        });
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
        rows.forEach((row) => {
          const player = row;
          const date = new Date(row.dateOfBirth);
          player.dateOfBirth = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        });
        return res.render('players/myPlayers', { players: rows });
      });
    } else {
      res.redirect('/');
    }
  },

  newPlayerForm: (req, res) => {
    if (req.session.email) {
      res.locals.connection.query('SELECT * FROM teams ', (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        return res.render('players/newPlayer', { teams: rows });
      });
    } else {
      res.redirect('/');
    }
  },

  addUser: (req, res) => {
    console.log(req.body);
  },
};
