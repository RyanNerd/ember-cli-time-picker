/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-time-picker',

  included()
  {
    this._super.included.apply(this, arguments);
    this.ui.writeLine('');
    this.ui.writeLine('https://github.com/RyanNerd/ember-cli-time-picker');
    this.ui.writeLine('Thanks for using the time-picker addon!');
    this.ui.writeLine('');
  }
};
