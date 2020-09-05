module.exports = class Location {
  constructor(name, color) {
    this.id = null;
    this.name = name;
    this.color = color;
  }

  parseInsert() {
    return [this.id, this.name, this.color];
  }
};
export default {};
