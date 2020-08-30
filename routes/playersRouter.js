import express from 'express';
import playersController from '../controllers/playersController';

const router = express.Router();

router.get('/', playersController.getAllPlayers);
router.get('/my-players', playersController.getMyPlayers);

module.exports = router;
