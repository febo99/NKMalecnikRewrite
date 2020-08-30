module.exports = {
  getAllTeams: (req, res) => {
    res.locals.connection.query('SELECT * FROM teams', (err, rows) => {
      if (err) {
        res.json({ error: err });
        throw err;
      }
      return res.json({ data: rows });
    });
  },
};
