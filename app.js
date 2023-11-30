const express = require('express');
const morgan = require('morgan');
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');
const AppError = require('./utlils/app-error');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to express', app: 'Natours' });
});

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  next(
    new AppError(`Can't find this url ${req.originalUrl} on this server`, 404),
  );
});

app.use(globalErrorHandler);

module.exports = app;
