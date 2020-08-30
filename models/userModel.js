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
};

export default { };
