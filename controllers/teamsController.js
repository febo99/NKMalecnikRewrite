import { userLogged } from '../utils/checkLogin';
import Team from '../models/teamModel';

module.exports = {
  getAllTeams: (req, res) => {
    if (userLogged(req)) {
      res.locals.connection.query('SELECT *,users.name AS username, teams.name AS team FROM teams INNER JOIN users on teams.coachID = users.ID', (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        return res.render('teams/teams', { teams: rows });
      });
    } else {
      res.redirect('/');
    }
  },

  addTeamForm: (req, res) => {
    if (userLogged(req)) {
      res.locals.connection.query('SELECT * FROM users', (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        const { error } = req.session;
        req.session.error = null;
        return res.render('teams/newTeam', { users: rows, error });
      });
    } else {
      res.redirect('/');
    }
  },

  addTeam: (req, res) => {
    if (userLogged(req)) {
      const error = {};
      const newTeam = new Team(req.body.name, req.body.notes, req.body.coach,
        req.body.assistant, req.body.technical);

      res.locals.connection.query('SELECT * FROM teams WHERE name = ?', newTeam.name, (err, rows) => {
        if (err) return res.json({ err });
        if (rows.length > 0) { // if team with same name already exists
          error.name = 'Ekipa s taksnim imenom ze obstaja!';
          req.session.error = error;
          return res.redirect('/teams/add-team');
        }

        return res.locals.connection.query('INSERT INTO teams VALUES ?', [[newTeam.parseInsert()]], (err1, result) => {
          if (err1) return res.json({ err1 });
          return res.json({ result });
        });
      });
    } else {
      res.redirect('/');
    }
  },
};
