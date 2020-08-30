module.exports = {
  getAllUser: (req, res) => {
    res.locals.connection.query('SELECT * FROM players', (err, rows) => {
      if (err) {
        res.json({ error: err });
        throw err;
      }
      return res.json({ data: rows });
    });
  },
};
