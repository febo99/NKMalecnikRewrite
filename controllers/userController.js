import bcrypt from 'bcrypt';
import User from '../models/userModel';

module.exports = {
  login: (req, res) => {
    res.locals.connection.query('SELECT * FROM users WHERE email=?', [req.body.email], (err, rows) => {
      if (err) {
        res.json({ error: err });
        throw err;
      }
      if (rows.length === 0) {
        return res.json({ error: 'Uporabnik ne obstaja!' });
      }
      const { password } = rows[0];
      bcrypt.compare(req.body.password, password, (compareErr, result) => {
        if (result) {
          const { email } = rows[0];
          const { role } = rows[0];
          const { userID } = rows[0].ID;
          req.session.email = email;
          req.session.role = role;
          req.session.userID = userID;
          return res.redirect('/dashboard');
        }
        return res.render('index', { err: 'Geslo se ne ujema!' });
      });
    });
  },

  logout: (req, res) => {
    if (req.session.email) {
      req.session.destroy();
      return res.render('logout', { data: 'Uspesno odjavljen!' });
    }
    return res.render('logout', { data: 'Nisi prijavljen!' });
  },

  addUser: (req, res) => {
    if (!req.session.email) return res.json({ err: 'You are not logged in!' });
    const saltRounds = 10;
    const newUser = new User(String(req.body.email), String(req.body.name),
      String(req.body.surname), String(req.body.password),
      String(req.body.phone), req.body.role);

    res.locals.connection.query('SELECT * FROM users WHERE email = ?', [newUser.email], (err, rows) => {
      if (err) {
        return res.json({ err });
      }
      if (rows.length > 0) return res.json({ err: 'Email je ze v uporabi!' });

      bcrypt.hash(newUser.password, saltRounds, (hashErr, hash) => {
        newUser.password = hash;
        res.locals.connection.query('INSERT INTO users VALUES ?', [[newUser.parseInsert()]], (err1, result) => {
          if (err1) return res.json({ err: err1 });
          return res.json({ result });
        });
      });
    });
  },

  getAllUsers: async (req, res) => {
    if (!req.session.email) return res.redirect('/');
    return res.locals.connection.query('SELECT * FROM users', async (err, rows) => {
      if (err) {
        res.json({ error: err });
        throw err;
      }
      return res.locals.connection.query('SELECT * FROM roles', async (err, roles) => res.render('./users/users', { data: rows, roles }));
    });
  },

  getUser: (req, res) => {
    if (!req.session.email) return res.redirect('/');
    const userID = req.params.id;
    return res.locals.connection.query('SELECT * FROM users WHERE ID = ?', [userID], (err, rows) => {
      if (err) {
        res.json({ error: err });
        throw err;
      }
      return res.json({ data: rows[0] });
    });
  },
};
