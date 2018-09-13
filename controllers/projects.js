const mongoose = require("mongoose");
const Project = require("../models/Project");
const Issue = require("../models/Issue");

exports.createIssue = async function(req, res) {
  await Project.deleteMany({});
  await Issue.deleteMany({});
  // created_on(date / time), updated_on(date / time), open(boolean, true for open, false for closed), and _id.

  const addIssue = project =>
    new Promise(async function(resolve, reject) {
      const getCurrentDate = () => new Date().toISOString();

      const issue = req.body;
      issue.project = project._id;
      const date = getCurrentDate();
      issue.created_on = date;
      issue.updated_on = date;
      issue.open = true;
      try {
        console.log(issue);
        const newIssue = await Issue.create(issue);
        resolve(newIssue);
      } catch {
        reject("issue creating issue");
      }
    });

  const name = req.params.project;
  if (!name) throw new Error("no project defined");
  let project = await Project.findOne({ name });
  if (!project) {
    project = await Project.create({ name });
  }
  const newIssue = await addIssue(project);
  console.log(newIssue);
  res.json(newIssue);
};
