/*
*
*
*       Complete the API routing below
*
*
*/

"use strict";

// var expect = require("chai").expect;
const express = require("express");
const router = express.Router();
const controllers = require("../controllers/projects");
const mongoose = require("mongoose");

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true
  }
);

router.get("/:project", controllers.getIssues);

router.post("/:project", controllers.createIssue);

router.put("/:project", controllers.editIssue);

router.delete("/:project", function(req, res) {
  const project = req.params.project;
});

module.exports = router;
