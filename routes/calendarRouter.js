import express from 'express';
import calendarController from '../controllers/calendarController';

const router = express.Router();

router.get('/', calendarController.calendar);

module.exports = router;
