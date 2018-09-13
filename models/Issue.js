const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  created_on: {
    type: String,
    required: true
  },
  updated_on: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  },
  assigned_to: String,
  status_text: String
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
