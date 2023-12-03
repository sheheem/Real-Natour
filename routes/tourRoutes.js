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
  .get(tourController.getAllTour)
  .post(
    authController.protectRoute,
    authController.restrictTo('admin', 'lead-guide', 'staff', 'user'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.tourById)
  .patch(
    authController.protectRoute,
    authController.restrictTo('admin', 'staff'),
    tourController.updateTour,
  )
  .delete(
    authController.protectRoute,
    authController.restrictTo('admin', 'staff'),
    tourController.deleteTour,
  );

module.exports = router;
