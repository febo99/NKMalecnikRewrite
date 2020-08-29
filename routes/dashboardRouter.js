const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.email) {
    res.render('dashboard', { user: { email: req.session.email, role: req.session.role, id: req.session.userID } });
  } else {
    res.render('index');
  }
});

module.exports = router;
