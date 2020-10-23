import { userLogged } from '../utils/checkLogin';

module.exports = {
  scouting: (req, res) => {
    if (userLogged(req)) {
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
        });
      });
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
  },

  addPlayer: (req, res) => {

  },
};
