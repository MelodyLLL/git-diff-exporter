const config = require('../config.json');
const { scheduleTask } = require('./scheduler');

config.projects.forEach(project => {
  const fullProjectConfig = {
    ...project,
    githubToken: config.githubToken,
    repoPath: `${config.cacheDir}/${project.projectName}`
  };
  scheduleTask(fullProjectConfig);
});
