/*
*
*
*       Complete the API routing below
*
*
*/

"use strict";

var expect = require("chai").expect;
const mongoose = require("mongoose");

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.DB);

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;
    })

    .post(function(req, res) {
      var project = req.params.project;
    })

    .put(function(req, res) {
      var project = req.params.project;
    })

    .delete(function(req, res) {
      var project = req.params.project;
    });
};
