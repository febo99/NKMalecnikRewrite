import bcrypt from 'bcrypt';
import xl from 'excel4node';
import { userLogged } from '../utils/checkLogin';

const getMonthName = (n) => {
  switch (n) {
    case 1: return 'Januar';
    case 2: return 'Februar';
    case 3: return 'Marec';
    case 4: return 'April';
    case 5: return 'Maj';
    case 6: return 'Junij';
    case 7: return 'Julij';
    case 8: return 'Avgust';
    case 9: return 'September';
    case 10: return 'Oktober';
    case 11: return 'November';
    case 12: return 'December';
    default: return null;
  }
};

const numberOfDays = (y, m) => new Date(y, m, 0).getDate();

module.exports = {
  getPage: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const { error, success } = req.session;
      req.session.error = null;
      req.session.success = null;
      return res.locals.connection.query('SELECT * FROM users', async (err, rows) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }

        res.render('admin/users', {
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          users: rows,
          error,
          success,
        });
      });
    }
    return res.redirect('/');
  },

  travelExpenesesPage: (req, res) => {
    if (userLogged(req)) {
      const { error } = req.session;
      req.session.error = null;
      res.locals.connection.query('SELECT * FROM users', (err, coaches) => {
        if (err) {
          return res.render('admin/generateExcel', {
            error,
            user: {
              email: req.session.email,
              role: req.session.role,
              id: req.session.userID,
              name: req.session.name,
              surname: req.session.surname,
            },
          });
        }
        return res.render('admin/generateExcel', {
          coaches,
          error,
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
        });
      });
    } else {
      return res.redirect('/');
    }
  },

  generateTrainingExpenes: (req, res) => {
    const queryTrainings = `SELECT * FROM trainings
    INNER JOIN locations ON trainings.locationID = locations.ID
    WHERE created = ? and MONTH(dateOfTraining) = ? and YEAR(dateOfTraining) = ?`;

    const queryMatches = `SELECT * FROM matches
    WHERE created = ? and MONTH(matchDate) = ? and YEAR(matchDate) = ?`;
    res.locals.connection.query(queryTrainings,
      [req.body.coach,
        req.body.month,
        req.body.year],
      (err, trainings) => {
        res.locals.connection.query(queryMatches,
          [req.body.coach,
            req.body.month,
            req.body.year], (err1, matches) => {
            res.locals.connection.query('SELECT * FROM users WHERE ID = ?', req.body.coach, (err2, coachGet) => {
              const monthName = getMonthName(Number(req.body.month));
              const nrDays = numberOfDays(req.body.year, req.body.month);
              const coach = coachGet[0];

              const wb = new xl.Workbook();
              const page = wb.addWorksheet();

              // Merge cells for header
              page.cell(1, 1, 1, 4, true).string(`Potni nalog - ${monthName} ${req.body.year}`);
              page.cell(1, 6, 1, 10, true).string(`${coach.ime} ${coach.priimek}`);

              // Merge cells for activites
              page.cell(2, 2, 2, 3, true).string('Treningi');
              page.cell(2, 4, 2, 5, true).string('Tekme');
              page.cell(2, 6, 2, 7, true).string('Sestanki');
              page.cell(2, 8, 2, 9, true).string('Ogledi tekem');
              page.cell(2, 10, 2, 11, true).string('Ostalo');
              page.cell(2, 12).string('Skupaj');

              for (let i = 2; i <= 11; i += 1) {
                page.cell(3, i).string(i % 2 === 0 ? 'Kraj' : 'km');
              }

              let kmSum;

              for (let i = 1; i <= nrDays; i += 1) {
                const cellRow = 4 + (i - 1);
                page.cell(cellRow, 1).string(i.toString());
                if (i === nrDays) {
                  page.cell(cellRow + 1, 1).string('Skupaj');
                  page.cell(cellRow + 1, 12).formula(`SUM(L4:L${cellRow})`);
                  kmSum = cellRow + 1;
                }

                page.cell(cellRow, 12).formula(`C${cellRow} + E${cellRow} + G${cellRow} + I${cellRow} + K${cellRow} `);
              }

              trainings.forEach((item) => {
                const trainingIndex = 4 + (new Date(item.datum).getDate() - 1);
                page.cell(trainingIndex, 2).string(item.ime);
                page.cell(trainingIndex, 3).string(req.body.km);
              });

              matches.forEach((item) => {
                const matchIndex = 4 + (new Date(item.datum).getDate() - 1);
                page.cell(matchIndex, 4).string(item.imeLokacije);
              });

              page.cell(38, 4).string('eur/km');
              page.cell(38, 5).number(Number(req.body.eur));
              page.cell(38, 6).formula(`L${kmSum} * E38`);

              return wb.write(`Potni_nalog-${coach.name}_${coach.surname}-${monthName}-${req.body.year}`, res);
            });
          });
      });
  },

  getPinRequests: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const { error } = req.session;
      req.session.error = null;
      const query = 'SELECT *, posts.ID AS postID FROM posts  INNER JOIN users ON posts.created = users.ID WHERE requestPin = 1';
      return res.locals.connection.query(query, (err, pinRequests) => {
        if (pinRequests) {
          pinRequests.forEach((item) => { // UTF -> slovenian locale format
            const orgDate = item.dateOfPost;
            // eslint-disable-next-line no-param-reassign
            item.dateOfPost = `${orgDate.getDate()}.${orgDate.getMonth() + 1}.${orgDate.getFullYear()} ${orgDate.getHours()}:${orgDate.getMinutes()}`;
          });
        }
        return res.render('admin/pinnedPostRequests', {
          error,
          pinRequests,
          err,
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
        });
      });
    }
    return res.redirect('/');
  },

  changePasswordPage: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      return res.locals.connection.query('SELECT email,ID FROM users WHERE ID = ?', req.params.id, async (err, data) => {
        if (err) {
          res.json({ error: err });
          throw err;
        }
        const { error, success } = req.session;
        req.session.error = null;
        req.session.success = null;
        return res.render('admin/changePasswordForm', {
          email: data[0].email,
          id: data[0].ID,
          user: {
            email: req.session.email,
            role: req.session.role,
            id: req.session.userID,
            name: req.session.name,
            surname: req.session.surname,
          },
          error,
          success,
        });
      });
    }
    return res.redirect('/');
  },

  changePassword: (req, res) => {
    if (req.session.email && req.session.role === 1) {
      const { password } = req.body;
      const saltRounds = 10;
      const userID = req.params.id;
      if (password.length < 8) {
        req.session.error = 'Prekratko geslo!';
        return res.redirect(`/admin/change-password/${userID}`);
      }
      return bcrypt.hash(password, saltRounds, (hashErr, hash) => {
        res.locals.connection.query('UPDATE users SET password = ? WHERE ID = ?', [hash, userID], (err) => {
          if (err) {
            req.session.error = `Napaka pri spremembi gesla! Koda napake: ${err}`;
            return res.redirect(`/admin/change-password/${userID}`);
          }
          if (hashErr) {
            req.session.error = `Napaka pri spremembi gesla! Koda napake: ${hashErr}`;
            return res.redirect(`/admin/change-password/${userID}`);
          }
          req.session.error = 'Uspesno spremenjeno geslo!';
          return res.redirect(`/admin/change-password/${userID}`);
        });
      });
    }
    return res.redirect('/dashboard');
  },

  decidePin: (req, res) => {
    const operation = req.body.accept || req.body.cancel;
    const postID = req.params.id;
    if (operation.toLowerCase() === 'sprejmi') {
      return res.locals.connection.query('UPDATE posts SET requestPin = 0, pinned = 1 WHERE ID = ?', postID, (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri zahtevku za pripenjanje objave! Koda napake ${err}`;
          return res.redirect('admin/pin-requests');
        }
        req.session.success = 'Pripenjanje uspesno!';
        return res.redirect('admin/pin-requests');
      });
    } if (operation.toLowerCase() === 'zavrni') {
      return res.locals.connection.query('UPDATE posts SET requestPin = 0, pinned = 0 WHERE ID = ?', postID, (err) => {
        if (err) {
          req.session.error = `Prislo je do napake pri zahtevku za pripenjanje objave! Koda napake ${err}`;
          return res.redirect('admin/pin-requests');
        }
        req.session.success = 'Preklic uspesen!';
        return res.redirect('admin/pin-requests');
      });
    }
    return res.redirect('/');
  },

};
