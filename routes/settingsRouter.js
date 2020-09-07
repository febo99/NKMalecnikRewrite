import express from 'express';
import settingsController from '../controllers/settingsController';

const router = express.Router();

router.get('/', settingsController.settings);
router.get('/new-location', settingsController.addLocationForm);
router.get('/locations', settingsController.locations);
router.get('/locations/edit-location/:id', settingsController.location);

router.post('/addLocation', settingsController.addLocation);
router.post('/editLocation/:id', settingsController.editLocation);

module.exports = router;
