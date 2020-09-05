import express from 'express';
import settingsController from '../controllers/settingsController';

const router = express.Router();

router.get('/', settingsController.settings);
router.get('/new-location', settingsController.addLocationForm);
router.get('/locations', settingsController.locations);

router.post('/addLocation', settingsController.addLocation);

module.exports = router;
