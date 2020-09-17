import express from 'express';
import teamsController from '../controllers/teamsController';

const router = express.Router();

router.get('/', teamsController.getAllTeams);
router.get('/add-team', teamsController.addTeamForm);
router.get('/team/:id', teamsController.getTeam);
router.get('/edit-team/:id', teamsController.editTeamForm);

router.post('/addTeam', teamsController.addTeam);
router.post('/editTeam/:id', teamsController.editTeam);
router.post('/deleteTeam/:id', teamsController.deleteTeam);

module.exports = router;
