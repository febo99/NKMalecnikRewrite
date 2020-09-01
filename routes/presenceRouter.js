import express from 'express';
import presenceController from '../controllers/presenceController';

const router = express.Router();

router.get('/', presenceController.presence);

module.exports = router;
