
require("dotenv").config('{ path: "E:\Downloads\SOFTWARE2_project-master\SOFTWARE2_project-master\SWE2-Project-master\Backend" }');
const { MongoClient } = require('mongodb');
const { convertToUppercase } = require('../helpers/convert');

const uri = process.env.connect_DB;
const dbName = 'test';
const collectionName = 'products';

let client, db, collection;

beforeAll(async () => {
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  collection = db.collection(collectionName);
});

afterAll(async () => {
  await client.close();
});

test('convert all product names to uppercase and validate', async () => {
  const products = await collection.find({}, { projection: { title: 1 } }).limit(10).toArray();

  await Promise.all(products.map(async (product) => {
    if (product.title) {
      const original = product.title;
      const converted = convertToUppercase(original);
      expect(converted).toEqual(original.toUpperCase());

      await collection.updateOne(
        { _id: product._id },
        { $set: { title: converted } }
      );
    }
  }));
}, 30000);
