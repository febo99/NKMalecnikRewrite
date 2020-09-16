module.exports = {
  getDashboard: (req, res) => {
    if (req.session.email) {
      const { error } = req.session;
      const { success } = req.session;
      req.session.error = null;
      req.session.success = null;
      const query = 'SELECT *, posts.ID AS postID FROM posts INNER JOIN users ON posts.created = users.ID ORDER BY pinned DESC, dateOfPost DESC ';
      res.locals.connection.query(query, (err, posts) => {
        if (err) {
          req.session.error = `Prislo je do napake! Koda napake: ${err}`;
          return res.redirect('/dashboard');
        }

        posts.forEach((item) => { // UTF -> slovenian locale format
          const orgDate = item.dateOfPost;
          // eslint-disable-next-line no-param-reassign
          item.dateOfPost = `${orgDate.getDate()}.${orgDate.getMonth() + 1}.${orgDate.getFullYear()} ${orgDate.getHours()}:${orgDate.getMinutes()}`;
        });
        return res.locals.connection.query('SELECT *, comments.ID AS commentID FROM comments INNER JOIN users ON comments.created = users.ID', (err2, comments) => {
          if (err2) {
            req.session.error = `Prislo je do napake! Koda napake: ${err2}`;
            return res.redirect('/dashboard');
          }

          comments.forEach((item) => { // UTF -> slovenian locale format
            const orgDate = item.dateComment;
            // eslint-disable-next-line no-param-reassign
            item.dateComment = `${orgDate.getDate()}.${orgDate.getMonth() + 1}.${orgDate.getFullYear()} ${orgDate.getHours()}:
            ${orgDate.getMinutes() === 0 ? '00' : orgDate.getMinutes()}`; // inline if to check if minutes are zero
          });

          return res.render('dashboard', {
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
            comments,
          });
        });
      });
    } else {
      res.redirect('/');
    }
  },

  addPost: (req, res) => {
    if (req.session.email) {
      const content = req.body.postContent;
      if (content.length > 250) {
        req.session.error = 'Objava je daljsa od 250 znakov!';
        return res.redirect('/dashboard');
      }
      if (content.length === 0) {
        req.session.error = 'Objava ne sme biti prazna!';
        return res.redirect('/dashboard');
      }
      const newPost = [null, new Date(), content, 0, 0, req.session.userID];
      return res.locals.connection.query('INSERT INTO posts VALUES ?', [[newPost]], (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri objavi! Koda napake: ${err}`;
          return res.redirect('/dashboard');
        }

        req.session.success = 'Objava uspesna!';
        return res.redirect('/dashboard');
      });
    }
    req.session.error = 'Nimas pravice!';
    return res.redirect('/dashboard');
  },

  addComment: (req, res) => {
    if (req.session.email) {
      const content = req.body.comment;
      if (content.length > 250) {
        req.session.error = 'Komentar je daljsi od 250 znakov!';
        return res.redirect('/dashboard');
      }
      if (content.length === 0) {
        req.session.error = 'Komentar ne sme biti prazen!';
        return res.redirect('/dashboard');
      }
      const newComment = [null, new Date(), content, req.params.id, req.session.userID];
      return res.locals.connection.query('INSERT INTO comments VALUES ?', [[newComment]], (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri komentarju! Koda napake: ${err}`;
          return res.redirect('/dashboard');
        }

        req.session.success = 'Komentar uspesen!';
        return res.redirect('/dashboard');
      });
    }
    req.session.error = 'Nimas pravice!';
    return res.redirect('/dashboard');
  },

  removeComment: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const commentID = req.params.id;
      return res.locals.connection.query('DELETE FROM comments WHERE ID = ?', commentID, (err, result) => {
        if (err) {
          req.session.error = `Prislo je do napake pri brisanju komentarja! Koda napake ${err}`;
          return res.redirect('/dashboard');
        }
        req.session.success = 'Komentar uspesno izbrisan!';
        return res.redirect('/dashboard');
      });
    }
    req.session.error = 'Nimas pravic!';
    return res.redirect('/dashboard');
  },

  removePost: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const postID = req.params.id;
      return res.locals.connection.query('DELETE FROM comments WHERE postID = ?', postID, (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri brisanju komentarjev! Koda napake ${err}`;
          return res.redirect('/dashboard');
        }
        return res.locals.connection.query('DELETE FROM posts WHERE ID = ?', postID, (err2) => {
          if (err2) {
            req.session.error = `Prislo je do napake pri brisanju objave! Koda napake ${err2}`;
            return res.redirect('/dashboard');
          }
          req.session.success = 'Objava uspesno izbrisana!';
          return res.redirect('/dashboard');
        });
      });
    }
    req.session.error = 'Nimas pravic!';
    return res.redirect('/dashboard');
  },

  requestPin: (req, res) => {
    if (req.session.email) {
      const postID = req.params.id;
      return res.locals.connection.query('UPDATE posts SET requestPin = 1 WHERE ID = ?', postID, (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri zahtevku za pripenjanje objave! Koda napake ${err}`;
          return res.redirect('/dashboard');
        }
        req.session.success = 'Zahteva za pripenjanje uspesno oddana!';
        return res.redirect('/dashboard');
      });
    }
    req.session.error = 'Potrebna prijava!';
    return res.redirect('/');
  },

  setPin: (req, res) => {
    if (req.session.email) {
      const postID = req.params.id;
      return res.locals.connection.query('UPDATE posts SET pinned = 1 WHERE ID = ?', postID, (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri pripenjanju objave! Koda napake ${err}`;
          return res.redirect('/dashboard');
        }
        req.session.success = 'Objava uspesno pripeta!';
        return res.redirect('/dashboard');
      });
    }
    req.session.error = 'Potrebna prijava!';
    return res.redirect('/');
  },

  removePin: (req, res) => {
    if (req.session.email) {
      const postID = req.params.id;
      return res.locals.connection.query('UPDATE posts SET pinned = 0 WHERE ID = ?', postID, (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri odpenjanju objave! Koda napake ${err}`;
          return res.redirect('/dashboard');
        }
        req.session.success = 'Objava uspesno odpeta!';
        return res.redirect('/dashboard');
      });
    }
    req.session.error = 'Potrebna prijava!';
    return res.redirect('/');
  },
};
