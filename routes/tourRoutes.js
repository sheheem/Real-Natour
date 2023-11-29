const express = require('express');
const controller = require('../controllers/tourController');

const router = express.Router();

// router.param('id', controller.checkId);
router.get('/top-5-cheap', controller.cheapNBest, controller.getAllTour);

router.get('/', controller.getAllTour).post('/', controller.createTour);

router
  .get('/:id', controller.tourById)
  .patch('/:id', controller.updateTour)
  .delete('/:id', controller.deleteTour);

module.exports = router;
