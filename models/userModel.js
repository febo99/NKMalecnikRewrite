module.exports = class User {
  constructor(email, name, surname, password, phone, role) {
    this.id = null;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.phone = phone;
    this.role = Number.parseInt(role, 10);
  }

  parseInsert() {
    return [this.id, this.email, this.name, this.surname, this.password, this.phone, this.role];
  }

  validateUser() {
    const error = [];
    if (!(this.email.includes('@'))) error.push('Neveljaven e-postni naslov!');
    if (this.password.length <= 5) error.push('Geslo mora biti dolgo vsaj 5 znakov!');
    if (error.length === 0) return false;
    return error;
  }
};

export default { };
