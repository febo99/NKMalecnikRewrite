import express from 'express';
import scoutingController from '../controllers/scoutingController';

const router = express.Router();

router.get('/', scoutingController.scouting);
router.get('/new-player', scoutingController.newPlayerForm);

module.exports = router;
