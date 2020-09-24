import express from 'express';
import multer from 'multer';
import trainingController from '../controllers/trainingsController';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.replace(' ', '_').replace(',', '_');
    cb(null, filename);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.get('/', trainingController.trainings);
router.get('/training/:id', trainingController.getTraining);
router.get('/new-training', trainingController.newTrainingForm);
router.get('/edit-training/:id', trainingController.editTrainingForm);

router.post('/addTraining', upload.array('attachments'), trainingController.addTraining);
router.post('/deleteTraining/:id', trainingController.deleteTraining);
router.post('/editTraining/:id', trainingController.editTraining);

module.exports = router;
