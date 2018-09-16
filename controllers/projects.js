const mongoose = require("mongoose");
const Project = require("../models/Project");
const Issue = require("../models/Issue");

exports.createIssue = async function(req, res, next) {
  // clearing db for testing
  await Project.deleteOne({ name: "test" });
  await Issue.deleteMany({});

  // ------------------

  function validateFields(...fields) {
    const fieldCheck = fields.some(
      field => typeof field !== "string" || field === ""
    );
    if (fieldCheck) {
      let err = new Error();
      // res.statusCode = 400;
      err.status = 400;
      err.message = "invalid field";
      return err;
    }
  }

  // addIssue to db
  const addIssue = project =>
    // wrap in promise so that it can be awaited
    new Promise(async function(resolve, reject) {
      // get current time as ISO time
      const getCurrentDate = () => new Date().toISOString();
      // set issue fields
      const issue = req.body;
      // check field input
      try {
        const { issue_title, issue_text, created_by } = issue;
        const fieldCheck = validateFields(issue_title, issue_text, created_by);
        if (fieldCheck instanceof Error) throw fieldCheck;
        // generate extra fields
        issue.project = project._id;
        const date = getCurrentDate();
        issue.created_on = date;
        issue.updated_on = date;
        issue.open = true;
        // create issue in db
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
    // respond with issue
    res.json(newIssue);
  } catch (err) {
    next(err);
  }
};
