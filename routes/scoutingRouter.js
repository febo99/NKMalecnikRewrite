import express from 'express';
import scoutingController from '../controllers/scoutingController';

const router = express.Router();

router.get('/', scoutingController.scouting);

module.exports = router;
