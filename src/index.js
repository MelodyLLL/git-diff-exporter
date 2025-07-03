const { scheduleTask } = require('./scheduler');
const config = require('../config.json');

scheduleTask(config);
