import { userLogged } from '../utils/checkLogin';

module.exports = {
  scouting: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      res.locals.connection.query('SELECT * FROM scouting', (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        return res.render('scouting/scouting', {
          scoutedPlayers: rows,
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

  newPlayerForm: (req, res) => {
    if (userLogged(req)) {
      return res.render('scouting/newPlayer', {
        user: {
          email: req.session.email,
          role: req.session.role,
          id: req.session.userID,
          name: req.session.name,
          surname: req.session.surname,
        },
      });
    }
    res.redirect('/');
  },

  addPlayer: (req, res) => {
    if (userLogged(req)) {
      const player = {
        id: null,
        club: req.body.club,
        name: req.body.name,
        surname: req.body.surname,
        year: Number.parseInt(req.body.year, 10),
        foot: req.body.foot,
        desc: req.body.description,
        created: req.session.userID,
      };
      console.log(Object.values(player));
      res.locals.connection.query('INSERT INTO scouting VALUES ?', [[Object.values(player)]], (err) => {
        if (err) {
          req.session.error = err;
          console.log(err);
          return res.redirect('/scouting/new-player');
        }
        req.session.error = 'Uspesno dodan igralec!';
        return res.redirect('/scouting/new-player');
      });
    } else {
      res.redirect('/');
    }
  },

  deletePlayer: (req, res) => {
    if (userLogged(req)) {
      const playerID = req.params.id;
      res.locals.connection.query('DELETE FROM scouting WHERE ID = ? ', playerID, (err) => {
        if (err) {
          req.session.error = err;
          return res.redirect('/scouting');
        }
        req.session.error = 'Uspesno zbrisan igralec!';
        return res.redirect('/scouting');
      });
    } else {
      return res.redirect('/');
    }
  },
};
