module.exports = class Training {
  constructor(title, dateOfTraining, intro, main,
    end, report, locationID, startTime, endTime, attachment, created) {
    this.id = null;
    this.title = title;
    this.dateOfTraining = dateOfTraining;
    this.intro = intro;
    this.main = main;
    this.end = end;
    this.report = report;
    this.locationID = locationID;
    this.startTime = startTime;
    this.endTime = endTime;
    this.attachment = attachment;
    this.created = created;
  }

  parseInsert() {
    return [this.id, this.title, this.dateOfTraining, this.intro, this.main,
      this.end, this.report, this.locationID, this.startTime,
      this.endTime, this.attachment, this.created];
  }
};
