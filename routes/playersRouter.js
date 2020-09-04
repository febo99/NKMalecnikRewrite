import express from 'express';
import playersController from '../controllers/playersController';

const router = express.Router();

router.get('/', playersController.getAllPlayers);
router.get('/my-players', playersController.getMyPlayers);
router.get('/new-player', playersController.newPlayerForm);
router.get('/edit-player/:id', playersController.editPlayerForm);

router.post('/addPlayer', playersController.addUser);
router.post('/editPlayer', playersController.editUser);

module.exports = router;
