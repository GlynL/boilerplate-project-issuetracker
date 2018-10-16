const mongoose = require("mongoose");
const Project = require("../models/Project");
const Issue = require("../models/Issue");

function errorMessage(status = 500, message = "something went wrong") {
  let err = new Error();
  err.status = status;
  err.message = message;
  return err;
}

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

exports.createIssue = async function(req, res, next) {
  // clearing db for testing
  // await Project.deleteOne({ name: "test" });
  // await Issue.deleteMany({});

  // ------------------

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

exports.editIssue = async function(req, res, next) {
  // get current time as ISO time
  const getCurrentDate = () => new Date().toISOString();

  const name = req.params.project;
  // make sure a name was passed in url
  if (!name) {
    let err = errorMessage(400, "no project");
    return next(err);
  }
  // make sure a body was passed in request
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    let err = errorMessage(400, "no request body");
    return next(err);
  }
  // make sure body contained an id
  if (!req.body._id) {
    let err = errorMessage(400, "no issue id included");
    return next(err);
  }

  // make sure issue id matches project
  try {
    // search for project
    let project = await Project.findOne({ name });
    // create new project if doesn't exist
    if (!project) {
      throw errorMessage(400, "project doesn't exist");
    }

    // build issue and update in DB
    let issue = req.body;
    issue.updated_on = getCurrentDate();
    const updatedIssue = await Issue.findByIdAndUpdate(req.body._id, issue, {
      new: true
    });
    // respond with issue
    res.json(updatedIssue);
  } catch (err) {
    next(err);
  }
};

exports.getIssues = async function(req, res, next) {
  const project = req.params.project;
  // check project is provided
  if (!project) next(errorMessage(400, "no project"));
  try {
    const issues = await Issue.find(req.query).populate({
      path: "project",
      match: { name: project }
    });

    const matchingIssues = issues.filter(
      issue => issue.project && issue.project.name === project
    );
    res.json(matchingIssues);
  } catch (err) {
    next(errorMessage(400, "error querying"));
  }
};

exports.removeIssue = async function(req, res, next) {
  const project = req.params.project;
  if (!project) next(errorMessage(400, "no project"));

  const id = req.body._id;
  if (!id) next(errorMessage(400, "_id error"));

  try {
    await Issue.findByIdAndRemove(id);
    res.json({ message: `successfully deleted ${id}` });
  } catch (err) {
    if (err) next(errorMessage(400, `could not delete ${id}`));
  }
};
