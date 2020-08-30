import express from 'express';
import dashboardController from '../controllers/dashboardController';

const router = express.Router();

router.get('/', dashboardController.getDashboard);

module.exports = router;
