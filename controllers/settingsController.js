import { userLogged } from '../utils/checkLogin';
import Location from '../models/locationModel';

module.exports = {
  settings: (req, res) => {
    res.render('./settings/settings');
  },

  locations: (req, res) => {
    if (userLogged(req)) {
      res.locals.connection.query('SELECT * FROM locations', (err, rows) => {
        if (err) return res.json({ err });
        return res.render('settings/locations', { locations: rows });
      });
    } else {
      res.redirect('/');
    }
  },

  addLocationForm: (req, res) => {
    if (userLogged(req)) {
      const err = req.session.error;
      req.session.error = null;
      return res.render('settings/newLocation', { err });
    }
    return res.redirect('/');
  },

  addLocation: (req, res) => {
    const newLocation = new Location(req.body.name, req.body.color);
    if (userLogged(req)) {
      res.locals.connection.query('SELECT * FROM locations WHERE name = ?', newLocation.name, (err, rows) => {
        if (err) return res.json({ err });
        if (rows.length > 0) { // check if location with same name already exsits
          res.session.error = 'Lokacija s tem imenom ze obstaja!';
          return res.redirect('/settings/add-location');
        }
        return res.locals.connection.query('INSERT INTO locations VALUES ?', [[newLocation.parseInsert()]], (err1, result) => {
          if (err1) return res.json({ err1 });
          return res.json({ result });
        });
      });
    } else {
      res.redirect('/');
    }
  },
};
