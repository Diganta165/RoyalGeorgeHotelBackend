import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory Mongo instance.
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  //Connect mongoose
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (collections) for (let col of collections) await col.deleteMany({});
});

beforeEach(async () => {
  // Reset all collections between tests
  const collections = await mongoose.connection.db?.collections();

  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) await mongo.stop();
  await mongoose.connection.close();
  await mongo.stop();
});
