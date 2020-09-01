import express from 'express';
import matchesController from '../controllers/matchesController';

const router = express.Router();

router.get('/', matchesController.matches);

module.exports = router;
