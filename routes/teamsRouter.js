import express from 'express';
import teamsController from '../controllers/teamsController';

const router = express.Router();

router.get('/', teamsController.getAllTeams);

module.exports = router;
