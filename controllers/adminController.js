module.exports = {
  getPage: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      res.render('admin/admin', {
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
