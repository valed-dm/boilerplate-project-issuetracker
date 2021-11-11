"use strict";
const mongoose = require("mongoose");
const issueDBModel = require("../dbSchema.js");

module.exports = function(app) {
  app

    .route("/api/issues/:project")

    .get((req, res) => {
      let project = req.params.project;
      let filterObject = Object.assign(req.query);
      filterObject["project"] = project;
      issueDBModel.find(filterObject, (err, issueList) => {
        if (!err && issueList) {
          return res.json(issueList);
        }
      });
    })

    .post((req, res) => {
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json({ error: "required field(s) missing" });
      }
      let project = req.params.project;
      const newIssue = new issueDBModel({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project
      });
      newIssue.save((err, savedIssue) => {
        if (!err && savedIssue) {
          return res.json(savedIssue);
        } else {
          console.log(err);
        }
      });
    })

    .put(async (req, res) => {
      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      await issueDBModel.findById(req.body._id, async (err, data) => {
        if (err) {
          return res.json({ error: "invalid _id" });
        } else {
          let updateObject = {};
          Object.keys(req.body).forEach(key => {
            if (req.body[key] != "") {
              updateObject[key] = req.body[key];
            }
          });
          if (Object.keys(updateObject).length < 2) {
            return res.json({
              error: "no update field(s) sent",
              _id: updateObject["_id"]
            });
          }
          updateObject["updated_on"] = new Date().toUTCString();
          await issueDBModel.findByIdAndUpdate(
            req.body._id,
            updateObject,
            { new: true },
            (err, issueUpdated) => {
              if (!err && issueUpdated) {
                return res.json({
                  result: "successfully updated",
                  _id: issueUpdated._id
                });
              } else if (!issueUpdated) {
                return res.json({
                  error: "could not update",
                  _id: req.body._id
                });
              }
            }
          );
        }
      });
    })

    .delete((req, res) => {
      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }
      issueDBModel.findByIdAndDelete(req.body._id, (err, issueDeleted) => {
        if (!err && issueDeleted) {
          return res.json({
            result: "successfully deleted",
            _id: issueDeleted._id
          });
        } else if (!issueDeleted) {
          return res.json({ error: "could not delete", _id: req.body._id });
        }
      });
    });
};
