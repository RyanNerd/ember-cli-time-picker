/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-time-picker',

  included()
  {
    this._super.included.apply(this, arguments);

    try {
      this.ui.writeLine('Initializing time-picker addon.');
    } catch (e) {
      // NOP
    }
  }
};
