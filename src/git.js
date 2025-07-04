const simpleGit = require('simple-git');

async function getGitDiffLogs(config) {
  const git = simpleGit(config.repoPath);
  const from = `__temp__${config.baseBranch}`;
  const to = `__temp__${config.compareBranch}`;

  const logs = await git.log({ from, to });
  return logs.all;
}

module.exports = { getGitDiffLogs };

