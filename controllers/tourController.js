/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tour.model');

const cheapNBest = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

const getAllTour = async (req, res) => {
  try {
    // FILTERITIG BY QUERY
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'limit', 'sort', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // ADVANCED FILTERING BY QUERY
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // SORTING BY QUERY
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // LIMITING FIELDS BY QUERY
    if (req.query.fields) {
      const field = req.query.fields.split(',').join(' ');
      query = query.select(field);
    } else {
      query = query.select('-__v');
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const allTour = await query;

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
