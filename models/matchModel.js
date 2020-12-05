module.exports = class Match {
  constructor(venue, type, teamID, opponent, matchDate, assembly, matchTime,
    locationID, locationName, homeGoals, awayGoals, created) {
    this.id = null;
    this.venue = venue;
    this.type = type;
    this.teamID = Number.parseInt(teamID, 10);
    this.opponent = opponent;
    this.matchDate = new Date(matchDate);
    this.assembly = assembly;
    this.matchTime = matchTime;
    this.locationID = Number.parseInt(locationID, 10);
    this.locationName = locationName;
    this.homeGoals = Number.parseInt(homeGoals, 10);
    this.awayGoals = Number.parseInt(awayGoals, 10);
    this.created = Number.parseInt(created, 10);
  }

  parseInsert() {
    return [this.id, this.venue, this.type, this.teamID, this.opponent,
      this.matchDate, this.assembly, this.matchTime, this.locationID,
      this.locationName, this.homeGoals, this.awayGoals, this.created];
  }
};
