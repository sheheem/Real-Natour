/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tour.model');
const APIFeatures = require('../utlils/api-features');

const cheapNBest = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

const getAllTour = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const allTour = await features.query;

    res.status(200).json({
      status: 'Success',
      results: allTour.length,
      data: {
        tours: allTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Not found',
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Created',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'Updated',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: 'Did not update',
    });
  }
};

const tourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: 'Tour not found',
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Deleted',
      data: {
        tour: deletedTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: 'Not Found',
    });
  }
};

module.exports = {
  getAllTour,
  createTour,
  updateTour,
  tourById,
  deleteTour,
  cheapNBest,
};
