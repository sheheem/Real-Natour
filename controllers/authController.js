const User = require('../models/user.model');
const catchAsync = require('../utlils/catchAsync');

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: 'Success',
    data: {
      newUser,
    },
  });
});
