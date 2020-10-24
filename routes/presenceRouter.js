import express from 'express';
import presenceController from '../controllers/presenceController';

const router = express.Router();

router.get('/', presenceController.presence);

router.post('/setTrainingPresence/:id', presenceController.setTrainingPresence);
router.post('/setMatchPresence/:id', presenceController.setMatchPresence);

module.exports = router;
