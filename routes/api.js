/*
*
*
*       Complete the API routing below
*
*
*/

"use strict";

// var expect = require("chai").expect;
const controllers = require("../controllers/projects");
const mongoose = require("mongoose");

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true
  }
);

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      const project = req.params.project;
    })

    .post(controllers.createIssue)

    .put(function(req, res) {
      const project = req.params.project;
    })

    .delete(function(req, res) {
      const project = req.params.project;
    });
};
