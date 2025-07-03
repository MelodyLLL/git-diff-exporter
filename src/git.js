const simpleGit = require('simple-git');

async function getGitDiffLogs(config) {
  const git = simpleGit(config.repoPath);
  await git.fetch();
  const logs = await git.log({
    from: config.baseBranch,
    to: config.compareBranch,
  });
  return logs.all;
}

module.exports = { getGitDiffLogs };