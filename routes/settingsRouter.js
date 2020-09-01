import express from 'express';
import settingsController from '../controllers/settingsController';

const router = express.Router();

router.get('/', settingsController.settings);

module.exports = router;
