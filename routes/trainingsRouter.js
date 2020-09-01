import express from 'express';
import trainingController from '../controllers/trainingsController';

const router = express.Router();

router.get('/', trainingController.trainings);

module.exports = router;
