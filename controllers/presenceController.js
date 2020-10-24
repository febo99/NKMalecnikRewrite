import { userLogged } from '../utils/checkLogin';

module.exports = {
  presence: (req, res) => {
    res.render('./presence/presence');
  },

  setTrainingPresence: (req, res) => {
    if (userLogged(req)) {
      req.session.error = null;

      let updateQueries = '';
      const trainingID = req.params.id;

      Object.entries(req.body).forEach((item) => {
        const playerID = Number.parseInt(item[0].replace('presence', ''), 10);
        const presenceStatus = Number.parseInt(item[1], 10);

        updateQueries += `UPDATE presenceTrainings SET presence = ${presenceStatus} WHERE playerID = ${playerID} AND trainingID = ${trainingID};`;
      });

      res.locals.connection.query(updateQueries, (err) => {
        if (err) {
          req.session.error = { error: `Napaka pri posodobitvi prisotnosti! Koda napake: ${err}` };
          console.log(err);
          res.redirect('/');
        }
        res.redirect(`/trainings/training/${trainingID}`);
      });
    } else {
      res.redirect('/');
    }
  },

  setMatchPresence: (req, res) => {
    if (userLogged(req)) {
      req.session.error = null;

      let updateQueries = '';
      const matchID = req.params.id;
      const values = Object.entries(req.body);
      for (let i = 0; i < values.length / 5; i += 1) {
        const playerID = Number.parseInt(values[0 + i * 5][0].replace('presence', ''), 10);
        const presenceStatus = Number.parseInt(values[0 + i * 5][1], 10);
        const minutes = Number.parseInt(values[1 + i * 5][1], 10);
        const goals = Number.parseInt(values[2 + i * 5][1], 10);
        const asissts = Number.parseInt(values[3 + i * 5][1], 10);
        const cards = String(values[4 + i * 5][1]);

        updateQueries += `UPDATE presenceMatches SET presence = ${presenceStatus}, 
        minutes = ${minutes},
        goals = ${goals},
        asissts = ${asissts},
        cards = "${cards}"
        WHERE playerID = ${playerID} AND matchID = ${matchID};`;
      }

      res.locals.connection.query(updateQueries, (err) => {
        if (err) {
          req.session.error = { error: `Napaka pri posodobitvi prisotnosti! Koda napake: ${err}` };
          console.log(err);
          return res.redirect('/');
        }
        res.redirect(`/matches/match/${matchID}`);
      });
    } else {
      res.redirect('/');
    }
  },
};
