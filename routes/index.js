const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.locals.connection.query('SELECT * FROM users', (err, rows) => {
    if (err) throw err;
    console.log(rows);
  });
  res.render('index', { title: 'Express', message: 'Testiram' });
});

module.exports = router;
