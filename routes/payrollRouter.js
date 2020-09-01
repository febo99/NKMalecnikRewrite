import express from 'express';
import payrollController from '../controllers/payrollController';

const router = express.Router();

router.get('/', payrollController.payroll);

module.exports = router;
