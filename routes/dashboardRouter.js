import express from 'express';
import dashboardController from '../controllers/dashboardController';

const router = express.Router();

router.get('/', dashboardController.getDashboard);

router.post('/addPost', dashboardController.addPost);
router.post('/addComment/:id', dashboardController.addComment);
router.post('/removeComment/:id', dashboardController.removeComment);
router.post('/removePost/:id', dashboardController.removePost);
router.post('/requestPin/:id', dashboardController.requestPin);
router.post('/pinPost/:id', dashboardController.setPin);
router.post('/removePin/:id', dashboardController.removePin);

module.exports = router;
