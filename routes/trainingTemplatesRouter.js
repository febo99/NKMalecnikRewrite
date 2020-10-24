import express from 'express';
import trainingTemplatesController from '../controllers/trainingTemplatesController';

const router = express.Router();

router.get('/new-template', trainingTemplatesController.addTemplatePage);
router.get('/:id', trainingTemplatesController.templatePage);
router.get('/', trainingTemplatesController.templatesPage);

router.post('/newTemplate', trainingTemplatesController.newTemplate);

module.exports = router;
