import Player from '../models/playerModel';
import { userLogged } from '../utils/checkLogin';

module.exports = {
  getAllPlayers: (req, res) => {
    if (userLogged(req)) {
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
        return res.render('players/players', {
          players: rows,
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

  getMyPlayers: (req, res) => {
    if (userLogged(req)) {
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
        return res.render('players/myPlayers', {
          players: rows,
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
        });
      });
    } else {
      res.redirect('/');
    }
  },

  newPlayerForm: (req, res) => {
    if (userLogged(req)) {
      res.locals.connection.query('SELECT * FROM teams ', (err, rows) => {
        if (err) {
          res.session.error = `Napaka pri pridobivanju podatkov! Koda napake: ${err}`;
          res.redirect('/players/newPlayerForm');
        }
        const { error } = req.session;
        const { oldValues } = req.session;
        req.session.error = null;
        req.session.oldValues = null;
        res.locals.connection.query('SELECT * FROM goalkeeperTeams ', (err2, gkTeams) => {
          if (err2) {
            res.session.error = `Napaka pri pridobivanju podatkov! Koda napake: ${err2}`;
            res.redirect('/players/newPlayerForm');
          }
          return res.render('players/newPlayer', {
            teams: rows,
            gkTeams,
            error,
            oldValues,
            user: {
              email: req.session.email,
              role: req.session.role,
              id: req.session.userID,
              name: req.session.name,
              surname: req.session.surname,
            },
          });
        });
      });
    } else {
      res.redirect('/');
    }
  },

  addPlayer: (req, res) => {
    if (userLogged(req)) {
      const error = {};
      const phoneNumberRegex = /^[\d ()+-]+$/;

      const newPlayer = new Player(req.body.name, req.body.surname, req.body.dateOfBirth,
        req.body.nationality === 'on' ? 0 : 1, req.body.gkTeam, req.body.address, req.body.postNumber,
        req.body.postName, req.body.playerPhone, req.body.playerEmail, req.body.dadName,
        req.body.dadPhone, req.body.dadEmail,
        req.body.mumName, req.body.mumPhone, req.body.mumEmail,
        req.body.emso, req.body.registerNumber, req.body.note, req.body.team, req.session.userID);

      // check if all not-null values are filled

      if (newPlayer.name === null || newPlayer.name === '') error.name = 'Obvezno polje - ime';
      if (newPlayer.surname === null || newPlayer.surname === '') error.surname = 'Obvezno polje - priimek';
      if (newPlayer.address === null || newPlayer.address === '') error.address = 'Obvezno polje - naslov';
      if (newPlayer.postNumber === null || newPlayer.postNumber === '') error.postNumber = 'Obvezno polje - postna stevilka';
      if (newPlayer.postName === null || newPlayer.postName === '') error.postName = 'Obvezno polje - posta';
      if (newPlayer.team === null || newPlayer.team === '') error.team = 'Obvezno polje - ekipa';

      // values validation TO-DO
      if (!phoneNumberRegex.test(newPlayer.playerPhone) || newPlayer.playerPhone === '') error.playerPhone = 'Neveljavna telefonska stevilka igralca!';
      if (!phoneNumberRegex.test(newPlayer.dadPhone) || newPlayer.dadPhone === '') error.dadPhone = 'Neveljavna telefonska stevilka oceta!';
      if (!phoneNumberRegex.test(newPlayer.mumPhone) || newPlayer.mumPhone === '') error.mumPhone = 'Neveljavna telefonska stevilka mame!';
      if (newPlayer.emso.length !== 13) error.emso = 'Neveljaven emso!';
      if (newPlayer.postNumber.length !== 4) error.postNumber = 'Neveljavna postna stevilka!';
      // nationality = 1 => slovenia, others = 0

      if (Object.keys(error).length !== 0) {
        req.session.error = error;
        req.session.oldValues = req.body;
        res.redirect('/players/new-player');
      } else if (Object.keys(error).length === 0) {
        res.locals.connection.query('INSERT INTO players VALUES ?', [[newPlayer.parseInsert()]], (err) => {
          if (err) {
            req.session.error = error;
            return res.redirect('/players/new-player');
          }
          req.session.error = 'Uspesno dodan igralec!';
          return res.redirect('/players/new-player');
        });
      }
    }
  },

  editPlayerForm: (req, res) => {
    if (userLogged(req)) {
      const playerID = req.params.id;
      res.locals.connection.query('SELECT * FROM players WHERE ID = ? ', playerID, (err, player) => {
        res.locals.connection.query('SELECT * FROM teams ', (err1, teams) => {
          if (err1) {
            req.session.error = `Napaka pri pridobivanju podatkov! Koda napake: ${err1}`;
            res.redirect(`/players/edit-player/${playerID}`);
          }
          res.locals.connection.query('SELECT * FROM goalkeeperTeams ', (err2, gkTeams) => {
            if (err2) {
              req.session.error = `Napaka pri pridobivanju podatkov! Koda napake: ${err1}`;
              res.redirect(`/players/edit-player/${playerID}`);
            }
            // eslint-disable-next-line no-param-reassign
            if (player[0].note === null) player[0].note = '';
            res.render('players/editPlayer', {
              user: {
                email: req.session.email,
                role: req.session.role,
                id: req.session.userID,
                name: req.session.name,
                surname: req.session.surname,
              },
              player: player[0],
              teams,
              gkTeams,
            });
          });
        });
      });
    } else {
      res.redirect('/');
    }
  },

  editPlayer: (req, res) => {
    if (userLogged(req)) {
      return res.json({ test: 'test' });
    }
    return res.redirect('/');
  },
};
