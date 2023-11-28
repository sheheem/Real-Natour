const express = require('express');
const controller = require('../controllers/tourController');

const router = express.Router();

// router.param('id', controller.checkId);

router.get('/', controller.getAllTour).post('/', controller.createTour);

router
  .get('/:id', controller.tourById)
  .patch('/:id', controller.updateTour)
  .delete('/:id', controller.deleteTour);

module.exports = router;
