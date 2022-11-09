const mongoose = require('mongoose')
require('dotenv').config()

connection = async () => {
  const URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@coder.nrxnhkn.mongodb.net/ecommerce`;
  await mongoose.connect(URI)
};

module.exports = connection