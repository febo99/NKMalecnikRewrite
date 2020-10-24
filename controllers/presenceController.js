module.exports = {
  presence: (req, res) => {
    res.render('./presence/presence');
  },

  setTrainingPresence: (req, res) => {
    console.log(req.body);
  },

  setMatchPresence: (req, res) => {

  },
};
