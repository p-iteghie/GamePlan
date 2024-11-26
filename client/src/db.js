const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/node-auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

const clearDatabase = async () => {
    try {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
            console.log(`Cleared collection: ${key}`);
        }

        console.log('All collections have been cleared.');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};

module.exports = { connectDB, clearDatabase };