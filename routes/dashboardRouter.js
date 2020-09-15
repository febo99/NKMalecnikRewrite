import express from 'express';
import dashboardController from '../controllers/dashboardController';

const router = express.Router();

router.get('/', dashboardController.getDashboard);

router.post('/addPost', dashboardController.addPost);
router.post('/addComment/:id', dashboardController.addComment);

module.exports = router;
