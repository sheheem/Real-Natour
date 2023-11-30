/* eslint-disable no-console */
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Unhandled Rejection: Shutting Down');
  console.log(err.name, err.message);
  process.exit(1);
});

const { mongoConnect, mongoStatus } = require('./utlils/mongo.utlils');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const port = process.env.PORT;

mongoStatus();

const server = app.listen(port, async () => {
  await mongoConnect(DB);
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection: Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
