module.exports = {
  getDashboard: (req, res) => {
    if (req.session.email) {
      const { error } = req.session;
      const { success } = req.session;
      req.session.error = null;
      req.session.success = null;
      res.locals.connection.query('SELECT * FROM posts INNER JOIN users ON posts.created = users.ID', (err, posts) => {
        if (err) {
          req.session.error = `Prislo je do napake! Koda napake: ${err}`;
          return res.redirect('/dashboard');
        }

        posts.forEach((item) => { // UTF -> slovenian locale format
          const orgDate = item.dateOfPost;
          // eslint-disable-next-line no-param-reassign
          item.dateOfPost = `${orgDate.getDate()}.${orgDate.getMonth() + 1}.${orgDate.getFullYear()} ${orgDate.getHours()}:${orgDate.getMinutes()}`;
        });

        res.render('dashboard', {
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          error,
          success,
          posts,
        });
      });
    } else {
      res.redirect('/');
    }
  },

  addPost: (req, res) => {
    if (req.session.email) {
      const content = req.body.postContent;
      console.log(content);
      if (content.length > 250) {
        req.session.error = 'Objava je daljsa od 250 znakov!';
        return res.redirect('/dashboard');
      }
      if (content.length === 0) {
        req.session.error = 'Objava ne sme biti prazna!';
        return res.redirect('/dashboard');
      }
      const newPost = [null, new Date(), content, req.session.userID];
      res.locals.connection.query('INSERT INTO posts VALUES ?', [[newPost]], (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri objavi! Koda napake: ${err}`;
          return res.redirect('/dashboard');
        }

        req.session.success = 'Objava uspesna!';
        return res.redirect('/dashboard');
      });
    } else {
      req.session.error = 'Nimas pravice!';
      return res.redirect('/dashboard');
    }
  },
};
