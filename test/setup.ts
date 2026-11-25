import { closeTestDatabase, truncateTables } from "./test-database.js";

beforeEach(async () => {
  await truncateTables();
});

afterAll(async () => {
  await closeTestDatabase();
});
