import express from 'express';
import adminController from '../controllers/adminController';

const router = express.Router();

router.get('/', adminController.getPage);
router.get('/change-password/:id', adminController.changePasswordPage);

router.post('/changePassword/:id', adminController.changePassword);
module.exports = router;
