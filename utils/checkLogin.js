module.exports = {
  userLogged: (req) => {
    if (req.session.email) return true;
    return false;
  },
};
