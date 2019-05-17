var mongoose = require("mongoose");

var commentSchema = mongoose.Schema (commentSchema, {
  test: String,
  author: String
});

module.exports = mongoose.model('Comment', commentSchema);