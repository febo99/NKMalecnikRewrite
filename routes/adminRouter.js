import express from 'express';
import adminController from '../controllers/adminController';

const router = express.Router();

router.get('/', adminController.getPage);
router.get('/change-password/:id', adminController.changePasswordPage);
router.get('/pin-requests', adminController.getPinRequests);
router.get('/travel-expenses', adminController.travelExpenesesPage);

router.post('/changePassword/:id', adminController.changePassword);
router.post('/decidePin/:id', adminController.decidePin);
router.post('/generateTravelExpenses', adminController.generateTrainingExpenes);

module.exports = router;
