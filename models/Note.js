const mongoose = require("mongoose");

// schema for notes
const NotesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  date: {
    type: Date,
    deflult: Date.now,
  },
});

module.exports = mongoose.model("notes", NotesSchema);
