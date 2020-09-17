import mysql from 'mysql';
import { userLogged, isUserAdminOrHOYD } from '../utils/checkLogin';
import Team from '../models/teamModel';

module.exports = {
  getAllTeams: (req, res) => {
    if (userLogged(req)) {
      const query = 'SELECT *,users.name AS username, teams.name AS team,teams.ID AS teamID FROM teams INNER JOIN users on teams.coachID = users.ID';
      res.locals.connection.query(query, (err, rows) => {
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

  getTeam: (req, res) => {
    const teamID = req.params.id;
    if (userLogged(req)) {
      const query = 'SELECT *,users.name AS userName, teams.name AS team, teams.ID AS teamID FROM teams INNER JOIN users on teams.coachID = users.ID WHERE teams.ID = ?';
      res.locals.connection.query(query, teamID, (err, team) => {
        if (err) {
          req.session.error = `Napaka pri pridobivanju te ekipe! Koda napake ${err} `;
          res.redirect('/teams');
        }
        const queryPlayers = 'SELECT * FROM players WHERE teamID = ?';
        res.locals.connection.query(queryPlayers, teamID, (err2, players) => {
          if (err2) {
            req.session.error = `Napaka pri pridobivanju te ekipe! Koda napake ${err} `;
            res.redirect('/teams');
          }
          res.render('teams/team', {
            user: {
              email: req.session.email,
              role: req.session.role,
              id: req.session.userID,
              name: req.session.name,
              surname: req.session.surname,
            },
            team: team[0],
            players,

          });
        });
      });
    } else {
      res.redirect('/');
    }
  },

  editTeamForm: (req, res) => {
    const teamID = req.params.id;
    const { error } = req.session;
    req.session.error = null;
    if (userLogged(req)) {
      const query = 'SELECT *,users.name AS userName, teams.ID as teamID, teams.name AS team FROM teams INNER JOIN users on teams.coachID = users.ID WHERE teams.ID = ?';
      res.locals.connection.query(query, teamID, (err, team) => {
        if (err) {
          req.session.error = `Napaka pri pridobivanju te ekipe! Koda napake ${err} `;
          res.redirect('/teams');
        }
        // eslint-disable-next-line no-param-reassign
        if (team[0].notes === null) team[0].notes = '';
        const queryUsers = 'SELECT * FROM users';
        res.locals.connection.query(queryUsers, (err2, users) => {
          if (err2) {
            req.session.error = `Napaka pri pridobivanju te ekipe! Koda napake ${err2} `;
            res.redirect('/teams');
          }
          res.render('teams/editTeam', {
            user: {
              email: req.session.email,
              role: req.session.role,
              id: req.session.userID,
              name: req.session.name,
              surname: req.session.surname,
            },
            team: team[0],
            users,
            error,
          });
        });
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
        return res.render('teams/newTeam', {
          users: rows,
          error,
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

  movePlayersForm: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      const teamID = req.params.id;
      res.locals.connection.query('SELECT * FROM players WHERE teamID = ?', teamID, (err, players) => {
        if (err) {
          req.session.error = `Napaka pri pridobivanju igralcev! Koda napake ${err}`;
          return res.redirect(`/teams/edit-team/${teamID}`);
        }
        res.locals.connection.query('SELECT * FROM teams', teamID, (err1, teams) => {
          if (err1) {
            req.session.error = `Napaka pri pridobivanju ekip! Koda napake ${err1}`;
            return res.redirect(`/teams/edit-team/${teamID}`);
          }
          res.render('teams/movePlayers', {
            user: {
              email: req.session.email,
              role: req.session.role,
              id: req.session.userID,
              name: req.session.name,
              surname: req.session.surname,
            },
            players,
            teams,
            teamID,
            error,
          });
        });
      });
    } else {
      res.redirect('/');
    }
  },

  addTeam: (req, res) => {
    if (isUserAdminOrHOYD(req)) {
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

        return res.locals.connection.query('INSERT INTO teams VALUES ?', [[newTeam.parseInsert()]], (err1) => {
          if (err1) {
            req.session.error = `Napaka pri dodajanju ekipe! Koda napake ${err1}`;
            return res.redirect('/teams/add-team');
          }
          req.session.error = 'Uspesno dodana ekipa!';
          return res.redirect('/teams/add-team');
        });
      });
    } else {
      req.session.error = 'Nimas pravice za to operacijo!';
      return res.redirect('/teams/add-team');
    }
  },

  editTeam: (req, res) => {
    if (isUserAdminOrHOYD(req)) {
      const teamID = Number.parseInt(req.params.id, 10);
      const editTeam = new Team(req.body.name, req.body.note, req.body.coach,
        req.body.assistant, req.body.technical);

      const query = 'UPDATE teams SET name = ?, notes = ?, coachID = ?, assistantID = ?, technicalID = ? WHERE ID = ?';
      res.locals.connection.query(query, [editTeam.name, editTeam.notes,
        editTeam.coachID, editTeam.assistantID, editTeam.technicalID, teamID],
      (err) => {
        if (err) {
          req.session.error = `Napaka pri urejanju ekipe! Koda napake ${err}`;
          return res.redirect(`/teams/edit-team/${teamID}`);
        }
        req.session.error = 'Uspesno urejanje ekipe!';
        return res.redirect(`/teams/edit-team/${teamID}`);
      });
    } else {
      req.session.error = 'Nimas pravice za to operacijo!';
      return res.redirect('/teams');
    }
  },

  deleteTeam: (req, res) => {
    if (isUserAdminOrHOYD(req)) {
      const teamID = Number.parseInt(req.params.id, 10);
      const playerQuery = 'UPDATE players SET teamID = 0 WHERE teamID = ?';
      res.locals.connection.query(playerQuery, teamID, (err) => {
        if (err) {
          req.session.error = `Napaka pri brisanju ekipe! Koda napake ${err}`;
          return res.redirect(`/teams/edit-team/${teamID}`);
        }
        const query = 'DELETE FROM teams WHERE ID = ?';
        res.locals.connection.query(query, teamID, (err1) => {
          if (err1) {
            req.session.error = `Napaka pri brisanju ekipe! Koda napake ${err1}`;
            return res.redirect(`/teams/edit-team/${teamID}`);
          }
          req.session.error = 'Uspesno izbrisana ekipa!';
          return res.redirect('/teams');
        });
      });
    } else {
      req.session.error = 'Nimas pravice za to operacijo!';
      return res.redirect('/teams');
    }
  },

  movePlayers: (req, res) => {
    if (isUserAdminOrHOYD(req)) {
      const teamID = Number.parseInt(req.params.id, 10);
      const selectedTeams = Object.entries(req.body);
      let queries = '';
      selectedTeams.forEach((item) => {
        const playerID = Number.parseInt(item[0].replace('player', ''), 10);
        const newTeamID = Number.parseInt(item[1], 10);
        queries += mysql.format(`UPDATE players SET teamID = ${newTeamID} WHERE ID = ${playerID};`);
        // must use mysql.format() to prevent sql injection
      });

      res.locals.connection.query(queries, (err) => {
        if (err) {
          req.session.error = `Premik igralcev ni uspel! Koda napake: ${err}`;
          return res.redirect(`/teams/move-players/${teamID}`);
        }
        req.session.error = 'Uspesen premik!';
        return res.redirect(`/teams/move-players/${teamID}`);
      });
    } else {
      req.session.error = 'Nimas pravice za to operacijo!';
      return res.redirect('/teams');
    }
  },
};
