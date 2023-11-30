const express = require('express');
const controller = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheap').get(controller.cheapNBest, controller.getAllTour);

router.route('/tour-stats').get(controller.getTourStats);

router.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

router.route('/').get(controller.getAllTour).post(controller.createTour);

router
  .route('/:id')
  .get(controller.tourById)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
