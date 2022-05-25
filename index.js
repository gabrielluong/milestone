const github = require("@actions/github");
const core = require('@actions/core');

async function run() {
  try {
    const token = core.getInput("github-token");
    const octokit = new github.getOctokit(token);
    const payload = github.context.payload;
    const repo = payload.repository.name;
    const owner = payload.repository.owner.login;
    const issueNumber = payload.issue && payload.issue.number;

    if (issueNumber === undefined) {
      core.warning("No issue number in payload.");
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

    const issue = await octokit.rest.issues.get({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
    });

    if (issue.data.milestone != null) {
      core.notice(`Milestone is already set for #${issueNumber} to ${issue.data.milestone.title}.`);
      return;
    }

    const milestone = milestones.data[0];

    await octokit.rest.issues.update({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      milestone: milestone.number,
    });

    core.notice(`Added milestone ${milestone.title} in #${issueNumber}.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
