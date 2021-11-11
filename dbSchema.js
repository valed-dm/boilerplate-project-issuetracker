var mongoose = require("mongoose");

var issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  status_text: String,
  open: { type: Boolean, required: true },
  created_on: { type: Date, required: true },
  updated_on: { type: Date, required: true },
  project: String
});

module.exports = mongoose.model("ISSUE", issueSchema, "issues");
