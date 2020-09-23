import express from 'express';
import trainingController from '../controllers/trainingsController';

const router = express.Router();

router.get('/', trainingController.trainings);
router.get('/training/:id', trainingController.getTraining);
router.get('/new-training', trainingController.newTrainingForm);
router.get('/edit-training/:id', trainingController.editTrainingForm);

router.post('/addTraining', trainingController.addTraining);
router.post('/deleteTraining/:id', trainingController.deleteTraining);
router.post('/editTraining/:id', trainingController.editTraining);

module.exports = router;
