module.exports = {
  getDashboard: (req, res) => {
    if (req.session.email) {
      res.render('dashboard', {
        user: {
          email: req.session.email,
          role: req.session.role,
          id: req.session.userID,
          name: req.session.name,
          surname: req.session.surname,
        },
      });
    } else {
      res.redirect('/');
    }
  },

};
