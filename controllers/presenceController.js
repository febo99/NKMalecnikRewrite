import { userLogged } from '../utils/checkLogin';

module.exports = {
  presence: (req, res) => {
    res.render('./presence/presence');
  },

  setTrainingPresence: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;

      let updateQueries = '';
      const trainingID = req.params.id;

      Object.entries(req.body).forEach((item) => {
        const playerID = Number.parseInt(item[0].replace('presence', ''), 10);
        const presenceStatus = Number.parseInt(item[1], 10);

        updateQueries += `UPDATE presenceTrainings SET presence = ${presenceStatus} WHERE playerID = ${playerID} AND trainingID = ${trainingID};`;
      });

      res.locals.connection.query(updateQueries, (err, trainings) => {
        if (err) {
          req.session.error = { error: `Napaka pri pridobivanju treningov! Koda napake: ${err}` };
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

  },
};
