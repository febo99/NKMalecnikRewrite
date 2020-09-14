import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.email) {
    res.redirect('/dashboard');
  }
  const err = req.session.error;
  req.session.error = null;
  res.render('index', { err });
});

module.exports = router;
