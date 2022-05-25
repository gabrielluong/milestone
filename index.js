const github = require("@actions/github");
const core = require('@actions/core');

async function run() {
  try {
    const closedBy = core.getInput("closed-by");
    const token = core.getInput("github-token");
    const octokit = new github.getOctokit(token);
    const payload = github.context.payload
    const repo = payload.repository.name;
    const owner = payload.repository.owner.login;
    const issueNumber = payload.issue && payload.issue.number;

    if (issueNumber === undefined) {
      core.warning("No issue number in payload.")
      return;
    }

    const milestones = await octokit.rest.issues.listMilestones({
      owner,
      repo,
    });

    if (!milestones.data.length) {
      core.warning("No opened milestones.");
      return;
    }

    const issue = await octokit.issues.get({
      owner: ownerName,
      repo: repoName,
      issue_number: issueNumber,
    });
    
    if (issue.data.milestone != null) {
      core.notice(`Milestone is already set for #${issueNumber}.`);
      return;
    } else if (issue.data["closed_by"] == null || issue.data["closed_by"].login != closedBy) {
      core.notice(`Closed by login does not match. Do nothing.`);
      return;
    }
    
    const milestone = milestones.data[0].number;

    await octokit.issues.update({
      owner: ownerName,
      repo: repoName,
      issue_number: issueNumber,
      milestone: milestone,
    });

    console.log(`Added milestone ${milestone.title} in #${issueNumber}.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
