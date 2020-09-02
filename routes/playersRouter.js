import express from 'express';
import playersController from '../controllers/playersController';

const router = express.Router();

router.get('/', playersController.getAllPlayers);
router.get('/my-players', playersController.getMyPlayers);
router.get('/new-player', playersController.newPlayerForm);
router.post('/addPlayer', playersController.addUser);

module.exports = router;
