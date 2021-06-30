const { promises: fs, existsSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');
const YAML = require('js-yaml');
const mkdirp = require('mkdirp');

class Config {
  async init() {
    mkdirp.sync(this.configDirectory, { mode: 0o770 });
    if (this.configExists) {
      await this.load();
    }
  }

  get apiKey() {
    return this.config.apiKey;
  }

  get chiaConfigDirectory() {
    return this.config.chiaConfigDirectory;
  }

  get chiaDaemonAddress() {
    return this.config.chiaDaemonAddress;
  }

  get excludedServices() {
    return this.config.excludedServices;
  }

  get chiaDashboardCoreUrl() {
    return this.config.chiaDashboardCoreUrl || 'https://us.chiadashboard.com';
  }

  get configExists() {
    return existsSync(this.configFilePath);
  }

  async load() {
    const yaml = await fs.readFile(this.configFilePath, 'utf8');
    this.config = YAML.load(yaml);
  }

  async save() {
    const yaml = YAML.dump(this.config, {
      lineWidth: 140,
    });
    await fs.writeFile(this.configFilePath, yaml, 'utf8');
  }

  get configFilePath() {
    return join(this.configDirectory, 'config.yaml')
  }

  get configDirectory() {
    return join(homedir(), '.config', 'spare-dashboard-satellite');
  }
}

module.exports = new Config();
