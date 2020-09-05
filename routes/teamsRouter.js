import express from 'express';
import teamsController from '../controllers/teamsController';

const router = express.Router();

router.get('/', teamsController.getAllTeams);
router.get('/add-team', teamsController.addTeamForm);

router.post('/addTeam', teamsController.addTeam);

module.exports = router;
