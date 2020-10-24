import express from 'express';
import trainingTemplatesController from '../controllers/trainingTemplatesController';

const router = express.Router();

router.get('/', trainingTemplatesController.templatesPage);

module.exports = router;
