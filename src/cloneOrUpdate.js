const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

function getRemoteUrl(config) {
  const { githubToken, remote } = config;
  const cleanRemote = remote.replace(/^https?:\/\//, '');
  return `https://${githubToken}@${cleanRemote}`;
}

async function ensureRepo(config) {
  const git = simpleGit();
  const { repoPath, baseBranch, compareBranch } = config;
  const remoteUrl = getRemoteUrl(config);

  if (!fs.existsSync(repoPath)) {
    console.log(`[${config.projectName}] 首次 clone 仓库中...`);
    await git.clone(remoteUrl, repoPath);
  }

  const repoGit = simpleGit(repoPath);

  // ✅ 拉取指定分支
  console.log(`[${config.projectName}] fetch 分支中...`);
  await repoGit.fetch('origin', baseBranch);
  await repoGit.fetch('origin', compareBranch);

  // ✅ 删除旧临时分支（避免脏状态）
  for (const branch of [baseBranch, compareBranch]) {
    const tempBranch = `__temp__${branch}`;
    const localBranches = (await repoGit.branchLocal()).all;
    if (localBranches.includes(tempBranch)) {
      await repoGit.deleteLocalBranch(tempBranch, true); // 强制删除
    }

    // ✅ 创建新临时分支并重置到远程分支最新状态
    await repoGit.checkout(['-b', tempBranch, `origin/${branch}`]);
  }
}


module.exports = { ensureRepo };
