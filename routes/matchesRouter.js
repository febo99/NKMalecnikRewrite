import express from 'express';
import matchesController from '../controllers/matchesController';

const router = express.Router();

router.get('/', matchesController.matches);
router.get('/new-match', matchesController.newMatchForm);
router.get('/match/:id', matchesController.match);

router.post('/addMatch', matchesController.addMatch);

module.exports = router;
