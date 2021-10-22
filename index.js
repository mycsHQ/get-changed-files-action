const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('token');
    const octokit = github.getOctokit(token)
    const repo = github.context.repo
    const files = new Map();
    let commitIDs = [];
    switch(github.context.eventName) {
      case 'push':
        commitIDs = getCommitsFromPush();
        break;
      case 'pull_request':
        commitIDs = await getCommitsFromPullRequest(octokit);
        break;
      default:
        core.debug("Unhandled event " + github.context.eventName);
        return;
    }
    for (const id of commitIDs) {
      const {data: commit}  = await octokit.rest.repos.getCommit({ 
        owner: repo.owner,
        repo: repo.repo,
        ref:  id
      });
      for (const file of commit.files) {
        add(files, 'all', file.filename)
        add(files, file.status, file.filename)
      }
    }
    let out = {};
    for (const [k,v] of files) {
      const values = Array.from(v)
      out[k] = values;
      core.setOutput(k, values);
    }
    console.log("Commits: ",  commitIDs);
    console.log("Output: ");
    console.log(JSON.stringify(out, undefined, 2));
  } catch (error) {
    core.setFailed(error.message);
  }
}

function getCommitsFromPush() {
  let commitIDs = [];
  for (const c of github.context.payload.commits) {
    commitIDs.push(c.id);
  }
  return commitIDs;
}

async function getCommitsFromPullRequest(octokit) {
  const {data: commits} = await octokit.rest.pulls.listCommits({ 
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.number
  })
  console.log(JSON.stringify(commits, undefined, 2));
  return commits.map(c => c.sha)
}

function add(map, key, value) {
  if (map.has(key)) {
    const s = map.get(key);
    s.add(value)
    map.set(key, s)
  } else {
    const s = new Set()
    s.add(value)
    map.set(key, s)
  }
}

run();
