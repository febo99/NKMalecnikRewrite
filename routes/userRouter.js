import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

router.post('/login', userController.login);
router.post('/addUser', userController.addUser);

router.get('/add-user', userController.addUserForm);
router.get('/logout', userController.logout);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);

module.exports = router;
