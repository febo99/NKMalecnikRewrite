import express from 'express';
import trainingController from '../controllers/trainingsController';

const router = express.Router();

router.get('/', trainingController.trainings);
router.get('/training/:id', trainingController.getTraining);
router.get('/new-training', trainingController.newTrainingForm);

module.exports = router;
