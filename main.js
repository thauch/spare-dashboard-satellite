#!/usr/bin/env node

const config = require('./lib/service/config');
const firstRunWizard = require('./lib/service/first-run-wizard');
const statsCollection = require('./lib/service/stats-collection');
const logger = require('./lib/service/logger');
const chiaDashboardUpdater = require('./lib/service/chia-dashboard-updater');
const version = require('./lib/version');

(async () => {
  await config.init();
  if (!config.configExists) {
    await firstRunWizard.run();
  }
  logger.log({ level: 'info', msg: `Config loaded from ${config.configFilePath} successfully` });
  logger.log({ level: 'info', msg: `Using ${config.chiaDashboardCoreUrl} for stats submissions` });
  chiaDashboardUpdater.init();
  await statsCollection.init();
  logger.log({ level: 'info', msg: `Spare-Dashboard-Satellite ${version} initialized` });

  process.on('SIGINT', async () => {
    await statsCollection.closeDaemonConnection();
    process.exit();
  });
})();
