import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/', userController.getAllUsers);

module.exports = router;
