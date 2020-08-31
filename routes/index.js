import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const err = req.session.error;
  req.session.error = null;
  res.render('index', { err });
});

module.exports = router;
