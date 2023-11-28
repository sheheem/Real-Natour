const dotenv = require('dotenv');
const { mongoConnect, mongoStatus } = require('./utlils/mongo.utlils');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const port = process.env.PORT;

mongoStatus();

app.listen(port, async () => {
  await mongoConnect(DB);
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}`);
});
