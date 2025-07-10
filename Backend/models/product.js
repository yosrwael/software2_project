const db = require("mongoose");

const product = db.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required:true,
  },
  discount: {
    type: Number,
    default: 0,
  },
});

module.exports = db.model("products", product);
