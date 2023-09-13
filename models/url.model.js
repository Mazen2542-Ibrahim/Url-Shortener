const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  shortId: {
    type: String,
    required: true,
  },
  clicked: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("shortUrl", shortUrlSchema);
