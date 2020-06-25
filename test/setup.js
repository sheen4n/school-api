const syncDb = require('../seeders/syncDb');
const server = require('../server');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await syncDb();
});

afterEach(async () => {
  await syncDb();
  server.close();
});
