import Player from '../models/playerModel';

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
        const { error } = req.session;
        const { oldValues } = req.session;
        req.session.error = null;
        req.session.oldValues = null;
        return res.render('players/newPlayer', { teams: rows, error, oldValues });
      });
    } else {
      res.redirect('/');
    }
  },

  addUser: (req, res) => {
    const error = {};
    const phoneNumberRegex = /^[\d ()+-]+$/;
    // check if all not-null values are filled
    const newPlayer = new Player(req.body.name, req.body.surname, req.body.dateOfBirth,
      req.body.nationality === 'on' ? 0 : 1, req.body.address, req.body.postNumber,
      req.body.postName, req.body.playerPhone, req.body.playerEmail, req.body.dadName,
      req.body.dadPhone, req.body.dadEmail,
      req.body.mumName, req.body.mumPhone, req.body.mumEmail,
      req.body.emso, req.body.registerNumber, req.body.note, req.body.teamID, req.session.userID);
    console.log(newPlayer);
    if (newPlayer.name === null || newPlayer.name === '') error.name = 'Obvezno polje - ime';
    if (newPlayer.surname === null || newPlayer.surname === '') error.surname = 'Obvezno polje - priimek';
    if (newPlayer.address === null || newPlayer.address === '') error.address = 'Obvezno polje - naslov';
    if (newPlayer.postNumber === null || newPlayer.postNumber === '') error.postNumber = 'Obvezno polje - postna stevilka';
    if (newPlayer.postName === null || newPlayer.postName === '') error.postName = 'Obvezno polje - posta';
    if (newPlayer.team === null || newPlayer.team === '') error.team = 'Obvezno polje - ekipa';

    // values validation TO-DO
    console.log(phoneNumberRegex.test(newPlayer.playerPhone));
    if (!phoneNumberRegex.test(newPlayer.playerPhone) || newPlayer.playerPhone === '') error.playerPhone = 'Neveljavna telefonska stevilka igralca!';
    if (!phoneNumberRegex.test(newPlayer.dadPhone) || newPlayer.dadPhone === '') error.dadPhone = 'Neveljavna telefonska stevilka oceta!';
    if (!phoneNumberRegex.test(newPlayer.mumPhone) || newPlayer.mumPhone === '') error.mumPhone = 'Neveljavna telefonska stevilka mame!';
    if (newPlayer.emso.length !== 13) error.emso = 'Neveljaven emso!';
    if (newPlayer.postNumber.length !== 4) error.postNumber = 'Neveljavna postna stevilka!';
    // nationality = 1 => slovenia, others = 0

    if (error.length !== 0) {
      req.session.error = error;
      req.session.oldValues = req.body;
      res.redirect('/players/new-player');
    } else if (error.length === 0) {
      res.locals.connection.query('INSERT INTO players VALUES ?', [newPlayer.parseInsert()], (err, result) => {
        if (err) return res.json({ err });
        return res.json({ result });
      });
    }
  },
};
