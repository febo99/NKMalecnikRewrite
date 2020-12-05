import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.email) {
    res.redirect('/dashboard');
  }
  const err = req.session.error;
  req.session.error = null;
  res.render('index', { err });
});

router.get('/uploads/:name', (req, res) => res.sendFile(path.join(`${__dirname}/../uploads/${req.params.name}`)));

module.exports = router;
