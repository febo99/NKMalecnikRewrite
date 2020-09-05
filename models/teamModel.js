module.exports = class Team {
  constructor(name, notes, coachID, assistantID, technicalID) {
    this.id = null;
    this.name = name;
    this.notes = notes;
    this.coachID = Number.parseInt(coachID, 10);
    this.assistantID = Number.parseInt(assistantID, 10);
    this.technicalID = Number.parseInt(technicalID, 10);
  }

  parseInsert() {
    return [this.id, this.name, this.notes, this.coachID, this.assistantID, this.technicalID];
  }
};
