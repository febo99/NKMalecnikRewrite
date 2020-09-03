module.exports = class Player {
  constructor(name, surname, dateOfBirth, nationality, address, postNumber,
    post, playerPhone, playerEmail, dadName, dadPhone, dadEmail,
    mumName, mumPhone, mumEmail, emso, registerNumber, note, teamID, created) {
    this.name = name;
    this.surname = surname;
    this.dateOfBirth = dateOfBirth;
    this.nationality = nationality;
    this.address = address;
    this.postNumber = postNumber;
    this.post = post;
    this.playerPhone = playerPhone;
    this.playerEmail = playerEmail;
    this.dadName = dadName;
    this.dadPhone = dadPhone;
    this.dadEmail = dadEmail;
    this.mumName = mumName;
    this.mumPhone = mumPhone;
    this.mumEmail = mumEmail;
    this.emso = emso;
    this.registerNumber = registerNumber;
    this.note = note;
    this.teamID = teamID;
    this.created = created;
  }

  parseInsert() {
    return [null, this.name, this.surname, this.dateOfBirth, this.nationality, this.address,
      this.postNumber, this.post, this.playerPhone, this.playerEmail, this.dadName, this.dadPhone,
      this.mumPhone, this.dadEmail, this.mumName,
      this.mumEmail, this.emso, this.registerNumber, this.teamID, this.created];
  }
};

export default { };
