/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tour.model');
const APIFeatures = require('../utlils/api-features');
const AppError = require('../utlils/app-error');
const catchAsync = require('../utlils/catchAsync');

const cheapNBest = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

const getAllTour = catchAsync(async (req, res) => {
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
});

const createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'Created',
    data: {
      tour: newTour,
    },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`No tour with id ${req.params.id}`, 404));
  }

  res.status(201).json({
    status: 'Updated',
    data: {
      tour,
    },
  });
});

const tourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError(`No tour with id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour: tour,
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);
  if (!deletedTour) {
    return next(new AppError(`No tour with id ${req.params.id}`, 404));
  }
  res.status(204).json({
    status: 'Deleted',
    data: {
      tour: deletedTour,
    },
  });
});

const getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'easy' } },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gt: new Date(`${year}-01-01`),
          $lt: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        name: { $addToSet: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStats: -1 },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      monthlyPlan,
    },
  });
});

module.exports = {
  getAllTour,
  createTour,
  updateTour,
  tourById,
  deleteTour,
  cheapNBest,
  getTourStats,
  getMonthlyPlan,
};
