// const cron = require('node-cron');
const { getGitDiffLogs } = require('./git');
const { exportToExcel } = require('./exporter');
// const { sendEmail } = require('./notifier');

// function scheduleTask(config) {
//   cron.schedule(config.schedule, async () => {
//     console.log(`[${new Date().toISOString()}] 开始生成 Git 差异报告...`);
//     const commits = await getGitDiffLogs(config);
//     const filePath = await exportToExcel(commits, config.projectName);
//     // await sendEmail(filePath, config);
//     console.log('报告已发送。');
    
//   });
// }



const { ensureRepo } = require('./cloneOrUpdate');

async function scheduleTask(config) {
  console.log(`[${new Date().toISOString()}] 准备拉取远程仓库...`);
  await ensureRepo(config);

  console.log(`[${new Date().toISOString()}] 开始生成 Git 差异报告...`);
  const commits = await getGitDiffLogs(config);
  const filePath = await exportToExcel(commits, config.projectName, config.repoPath);
  console.log('报告生成完成，文件路径：', filePath);
}


module.exports = { scheduleTask };
