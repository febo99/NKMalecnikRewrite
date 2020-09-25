import moment from 'moment';
import { userLogged, isUserAdminOrHOYD } from '../utils/checkLogin';
import { htmlInputFormatDate } from '../utils/formatDate';
import Match from '../models/matchModel';

module.exports = {
  matches: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      const query = 'SELECT *, matches.ID AS matchID FROM matches INNER JOIN teams ON teams.ID = matches.teamID';
      res.locals.connection.query(query, (err, matches) => {
        if (err) {
          req.session.error = `Napak pri pridobivanju tekem! Koda napake: ${err}`;
          return res.redirect('/matches');
        }
        res.render('./matches/matches', {
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          matches,
          error,
        });
      });
    } else {
      res.redirect('/');
    }
  },

  match: (req, res) => {
    if (userLogged(req)) {
      const matchID = Number(req.params.id);
      const { error } = req.session;
      req.session.error = null;
      const matchQuery = `SELECT * FROM matches INNER JOIN locations ON matches.locationID = locations.ID 
INNER JOIN teams ON matches.teamID = teams.ID WHERE matches.ID = ?`;
      res.locals.connection.query(matchQuery, matchID, (err, match) => {
        console.log({ err, match: match[0] });
        if (err) {
          req.session.error = `Napaka pri pridobivanju tekme! Koda napake: ${err}`;
          res.redirect('/matches');
        }
        res.render('./matches/match', {
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          match: match[0],
          error,
        });
      });
    } else {
      res.redirect('/');
    }
  },

  newMatchForm: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      res.locals.connection.query('SELECT * FROM locations', (err, locations) => {
        if (err) {
          req.session.error = `Napak pri pridobivanju lokacij! Koda napake: ${err}`;
          return res.redirect('/matches');
        }
        res.locals.connection.query('SELECT * FROM teams', (err1, teams) => {
          if (err1) {
            req.session.error = `Napak pri pridobivanju lokacij! Koda napake: ${err1}`;
            return res.redirect('/matches');
          }
          res.render('./matches/newMatch', {
            user: {
              email: req.session.email,
              role: req.session.role,
              id: req.session.userID,
              name: req.session.name,
              surname: req.session.surname,
            },
            locations,
            teams,
            error,
          });
        });
      });
    } else {
      res.redirect('/');
    }
  },

  addMatch: (req, res) => {
    if (userLogged(req)) {
      const error = {};
      const newMatch = new Match(req.body.locationType, req.body.type, req.body.team,
        req.body.awayTeam, req.body.matchDate,
        req.body.assemblyTime, req.body.matchStart, req.body.locationHome,
        req.body.locationAway, req.body.homeGoals, req.body.homeGoals,
        req.session.userID);

      // validation of input
      if (newMatch.homeGoals < 0 || newMatch.awayGoals < 0) {
        error.negativeGoalsError = 'Stevilo golov ne sme biti manjse od 0!';
        req.session.error = error;
        return res.redirect('/matches/new-match');
      }

      res.locals.connection.query('INSERT INTO matches VALUES ?', [[newMatch.parseInsert()]], (err, match) => {
        if (err) {
          error.insertError = `Napak pri vstavljanju tekme! Koda napake ${err}`;
          res.redirect('/matches/new-match');
        }
        res.redirect(`/matches/match/${match.insertId}`);
      });
    } else {
      res.redirect('/');
    }
  },
};
