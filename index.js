const BaseServerlessPlugin = require('base-serverless-plugin');

const LOG_PREFFIX = '[ServerlessStackResource] -';
const USR_CONF = 'pluginConfig';

class ServerlessStackResource extends BaseServerlessPlugin {
  /**
   * Default Constructor
   *
   * @param {object} serverless the serverless instance
   * @param {object} options command line arguments
   */
  constructor(serverless, options) {
    super(serverless, options, LOG_PREFFIX, USR_CONF);
    this.provider = serverless.getProvider('aws');

    this.hooks = {
      'before:deploy:deploy': this.dispatchAction.bind(this, this.deploy),
      'after:deploy:deploy': this.dispatchAction.bind(this, this.deploy),
      'after:remove:remove': this.dispatchAction.bind(this, this.remove),
      'after:info:info': this.dispatchAction.bind(this, this.info),
    };
  }

  /**
   * Action Wrapper check plugin condition before perform action
   *
   * @param {function} funAction serverless plugin action
   */
  async dispatchAction(funAction) {
    if (this.isPluginDisabled()) {
      this.log('warning: plugin is disabled');
      return '';
    }

    this.loadConfig();
    return funAction.call(this);
  }

  /**
   * Load user config
   *
   */
  loadConfig() {
    this.cfg = {};
    this.cfg.prop = this.getConf('prop', false, 'default_value');
    this.cfg.requiredProp = this.getConf('prop', true);
  }

  /**
   * Deploy
   *
   */
  async deploy() {
    this.log('Deploy...');
  }

  /**
   * Info
   *
   */
  async info() {
    this.log('Info...');
  }

  /**
   * Remove
   *
   */
  async remove() {
    this.log('Removing...');
  }

  /**
   * describeStack
   *
   * @param {string} stackName
   */
  describeStack(stackName) {
    this.provider.request('CloudFormation', 'describeStacks', {
      StackName: stackName,
    });
  }


  createStack() {
    this.provider.request('CloudFormation', 'createStack', { });
  }


  updateStack() {
    this.provider.request('CloudFormation', 'updateStack', { });
  }


  deleteStack() {
    this.provider.request('CloudFormation', 'deleteStack', { });
  }
}

module.exports = ServerlessStackResource;
