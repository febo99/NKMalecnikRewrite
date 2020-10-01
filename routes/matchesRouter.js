import express from 'express';
import matchesController from '../controllers/matchesController';

const router = express.Router();

router.get('/', matchesController.matches);
router.get('/my-matches', matchesController.myMatches);
router.get('/new-match', matchesController.newMatchForm);
router.get('/match/:id', matchesController.match);
router.get('/edit-match/:id', matchesController.editMatchForm);

router.post('/addMatch', matchesController.addMatch);
router.post('/editMatch/:id', matchesController.editMatch);

module.exports = router;
