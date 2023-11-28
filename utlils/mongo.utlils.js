/* eslint-disable no-console */
const mongoose = require('mongoose');

async function mongoConnect(mongoUrl) {
  await mongoose.connect(mongoUrl);
}

async function mongoStatus() {
  await mongoose.connection.once('open', () => {
    console.log('Mongodb Connected');
  });

  await mongoose.connection.on('error', (err) => {
    console.log(err);
  });
}

module.exports = {
  mongoConnect,
  mongoStatus,
};
