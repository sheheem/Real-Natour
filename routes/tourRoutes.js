const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.cheapNBest, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protectRoute, tourController.getAllTour)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.tourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
