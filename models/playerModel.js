module.exports = class Player {
  constructor(name, surname, dateOfBirth, nationality, gkTeam, address, postNumber,
    post, playerPhone, playerEmail, dadName, dadPhone, dadEmail,
    mumName, mumPhone, mumEmail, emso, registerNumber, note, teamID, created) {
    this.name = String(name);
    this.surname = String(surname);
    this.dateOfBirth = dateOfBirth;
    this.nationality = Number.parseInt(nationality, 10);
    this.gkTeam = Number.parseInt(gkTeam, 10);
    this.address = String(address);
    this.postNumber = String(postNumber);
    this.post = String(post);
    this.playerPhone = String(playerPhone);
    this.playerEmail = String(playerEmail);
    this.dadName = String(dadName);
    this.dadPhone = String(dadPhone);
    this.dadEmail = String(dadEmail);
    this.mumName = String(mumName);
    this.mumPhone = String(mumPhone);
    this.mumEmail = String(mumEmail);
    this.emso = String(emso);
    this.registerNumber = String(registerNumber);
    this.note = String(note);
    this.teamID = Number.parseInt(teamID, 10);
    this.created = Number.parseInt(created, 10);
  }

  parseInsert() {
    return [null, this.name, this.surname, this.dateOfBirth, this.nationality, this.gkTeam,
      this.address, this.postNumber, this.post, this.playerPhone,
      this.playerEmail, this.dadName, this.dadPhone,
      this.dadEmail, this.mumName, this.mumPhone,
      this.mumEmail, this.emso, this.registerNumber, this.note, this.teamID, this.created];
  }

  parseUpdate(playerID) {
    return [this.name, this.surname, this.dateOfBirth, this.nationality, this.gkTeam,
      this.address, this.postNumber, this.post, this.playerPhone,
      this.playerEmail, this.dadName, this.dadPhone,
      this.dadEmail, this.mumName, this.mumPhone,
      this.mumEmail, this.emso, this.registerNumber, this.note, this.teamID, playerID];
  }
};

export default { };
