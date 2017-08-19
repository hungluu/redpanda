import kindOf from 'kind-of'
import CONSTANTS from 'CONSTANTS'

class Config {
  constructor () {
    this.list = {}
  };

  set(key, value) {
    if (kindOf(value) !== 'object') {
      throw Error('[RedPanda Config] Only object is supported as request config.')
    }
  };

  get(key) {
    if (kindOf(key) === 'object') {
      return key
    }
    else if (kindOf(this.options[key]) === 'object') {
      return this.list[key]
    }
    else {
      throw Error('[RedPanda Config] No valid config for requested key')
    }
  };

  _applyAll(config) {
    if (kindOf(config.mode) === 'undefined') {
      config.mode = CONSTANTS.MODES.NORMAL
    }

    switch (config.mode) {
      case CONSTANTS.MODES.NORMAL:
        break;

      default:
        break;
    }
  };

  _applyCopies(config) {

  };

  _applyInherits(config) {

  };
};

export default Config
