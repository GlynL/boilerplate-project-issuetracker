const mongoose = require("mongoose");
const Project = require("../models/Project");
const Issue = require("../models/Issue");

exports.createIssue = async function(req, res) {
  // clearing db for testing
  await Project.deleteMany({});
  await Issue.deleteMany({});
  // ------------------

  // addIssue to db
  const addIssue = project =>
    // wrap in promise so that it can be awaited
    new Promise(async function(resolve, reject) {
      // get current time as ISO time
      const getCurrentDate = () => new Date().toISOString();
      // set issue fields
      const issue = req.body;
      issue.project = project._id;
      const date = getCurrentDate();
      issue.created_on = date;
      issue.updated_on = date;
      issue.open = true;
      // create issue in db
      try {
        const newIssue = await Issue.create(issue);
        resolve(newIssue);
      } catch (err) {
        reject(err);
      }
    });

  const name = req.params.project;

  // make sure a name was passed in url
  if (!name) throw new Error("no project defined");
  try {
    // search for project
    let project = await Project.findOne({ name });
    // create new project if doesn't exist
    if (!project) {
      project = await Project.create({ name });
    }
    // add issue
    const newIssue = await addIssue(project);
    console.log(newIssue);
    // respond with issue
    res.json(newIssue);
  } catch (err) {
    throw new Error(err);
  }
};
