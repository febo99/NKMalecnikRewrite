const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', message: 'Testiram' });
});

module.exports = router;
