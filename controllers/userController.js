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
        req.session.error = 'Uporabnik ne obstaja!';
        return res.redirect('/');
      }
      const { password } = rows[0];
      return bcrypt.compare(req.body.password, password, (compareErr, result) => {
        if (result) {
          const { email } = rows[0];
          const { role } = rows[0];
          const { ID } = rows[0];
          const { name } = rows[0];
          const { surname } = rows[0];
          req.session.email = email;
          req.session.role = role;
          req.session.userID = ID;
          req.session.name = name;
          req.session.surname = surname;
          return res.redirect('/dashboard');
        }
        req.session.error = 'Vneseno geslo ni pravilno!';
        return res.redirect('/');
      });
    });
  },

  logout: (req, res) => {
    if (req.session.email) {
      req.session.destroy();
      return res.render('index', { data: 'Uspesno odjavljen!' });
    }
    return res.redirect('/');
  },

  addUser: (req, res) => {
    if (!req.session.email) return res.json({ err: 'You are not logged in!' });
    if (req.session.role !== 1) { // if user is not admin we check if he is HOYD
      if (req.session.role !== 2) { // if user isn't HOYD we return error
        req.session.error = 'Nimas pravic za to operacijo!';
        return res.redirect('/users/add-user');
      }
    }
    const saltRounds = 10;
    const newUser = new User(String(req.body.email), String(req.body.name),
      String(req.body.surname), String(req.body.password),
      String(req.body.phone), req.body.role);

    const newUserError = newUser.validateUser();

    if (newUserError) {
      req.session.error = newUserError;
      return res.redirect('/users/add-user');
    }

    return res.locals.connection.query('SELECT * FROM users WHERE email = ?', [newUser.email], (err, rows) => {
      if (err) {
        req.session.error = `Napaka pri pridobivanju podatkov! Koda napake: ${err}`;
        return res.redirect('/users/add-user');
      }
      if (rows.length > 0) {
        req.session.error = 'Email je ze v uporabi!';
        return res.redirect('/users/add-user');
      }

      return bcrypt.hash(newUser.password, saltRounds, (hashErr, hash) => {
        newUser.password = hash;

        res.locals.connection.query('INSERT INTO users VALUES ?', [[newUser.parseInsert()]], (err1) => {
          if (err1) {
            req.session.error = `Vstavljanje novega uporabnika neuspesno! Koda napake: ${err1}`;
            return res.redirect('/users/add-user');
          }
          req.session.error = 'Vstavljanje novega uporabnika uspesno!';
          return res.redirect('/users/add-user');
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
      const { error } = req.session;
      req.session.error = null;
      await res.locals.connection.query('SELECT * FROM roles', async (err1, roles) => res.render('./users/users', {
        user: {
          email: req.session.email,
          role: req.session.role,
          id: req.session.userID,
          name: req.session.name,
          surname: req.session.surname,
        },
        data: rows,
        roles,
        error,
      }));
    });
  },

  getUser: (req, res) => {
    if (!req.session.email) return res.redirect('/');
    const userID = req.params.id;
    return res.locals.connection.query('SELECT *,users.ID as userID, roles.ID as roleID FROM users  INNER JOIN roles ON users.role = roles.ID WHERE users.ID = ?', [userID], (err, rows) => {
      if (err) {
        res.json({ error: err });
        throw err;
      }
      res.locals.connection.query('SELECT * FROM roles', (err2, roles) => {
        if (err) {
          res.json({ error: err2 });
          throw err2;
        }
        const { msg } = req.session;
        req.session.msg = null;
        return res.render('./users/user', {
          user: rows[0], session: req.session, roles, msg,
        });
      });
    });
  },

  addUserForm: async (req, res) => {
    if (!req.session.email) return res.redirect('/');
    return res.locals.connection.query('SELECT * FROM teams', async (err, teams) => {
      const { error } = req.session;
      req.session.error = null;
      await res.locals.connection.query('SELECT * FROM roles', async (err2, roles) => res.render('./users/newUserForm', { roles, teams, error }));
    });
  },

  editUser: async (req, res) => {
    const userID = req.params.id;
    if (!req.session.email) return res.redirect('/');

    if (req.session.role !== 1) { // if user is not admin we check if he is HOYD
      if (req.session.role !== 2) { // if user isn't HOYD we return error
        req.session.msg = 'Nimas pravic za to operacijo!';
        return res.redirect(`/users/${userID}`);
      }
    }

    const editedUser = new User(
      String(req.body.email),
      String(req.body.name),
      String(req.body.surname), null,
      String(req.body.phone),
      Number.parseInt(req.body.role, 10),
    );

    return res.locals.connection.query('UPDATE users SET email = ?, name = ?, surname = ?, phone = ?, role = ? WHERE ID = ?',
      [editedUser.email,
        editedUser.name,
        editedUser.surname,
        editedUser.phone,
        editedUser.role,
        userID],
      (err, result) => {
        if (err) {
          req.session.msg = `Urejanje ni bilo uspesno! Koda napake: ${err}`;
          return res.redirect(`/users/${userID}`);
        }
        if (result.changedRows === 1) { req.session.msg = 'Urejanje uspesno!'; } else if (result.changedRows === 0) { req.session.msg = 'Ni prislo do sprememb!'; }
        return res.redirect(`/users/${userID}`);
      });
  },
};
