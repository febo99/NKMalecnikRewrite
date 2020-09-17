module.exports = {
  userLogged: (req) => {
    if (req.session.email) return true;
    return false;
  },

  isUserAdminOrHOYD: (req) => {
    if (req.session.email && (req.session.role === 2 || req.session.role === 1)) return true;
    return false;
  },
};
