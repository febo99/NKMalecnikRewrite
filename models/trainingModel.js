module.exports = class Training {
  constructor(title, dateOfTraining, intro, main,
    end, report, locationID, startTime, endTime, attachment, teamID, created) {
    this.id = null;
    this.title = title;
    this.dateOfTraining = new Date(dateOfTraining);
    this.intro = intro;
    this.main = main;
    this.end = end;
    this.report = report;
    this.locationID = Number.parseInt(locationID, 10);
    this.startTime = new Date(startTime);
    this.endTime = endTime;
    this.attachment = attachment;
    this.teamID = Number.parseInt(teamID, 10);
    this.created = Number.parseInt(created, 10);
  }

  parseInsert() {
    return [this.id, this.title, this.dateOfTraining, this.intro, this.main,
      this.end, this.report, this.locationID, this.startTime,
      this.endTime, this.attachment, this.teamID, this.created];
  }
};
