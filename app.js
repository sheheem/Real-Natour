const express = require('express');
const morgan = require('morgan');
const tourRoute = require('./routes/tourRoutes');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to express', app: 'Natours' });
});

app.use('/api/v1/tours', tourRoute);

module.exports = app;
