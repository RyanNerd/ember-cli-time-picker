/* jshint ignore:start */
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import { run } from "@ember/runloop";

let App;

moduleForComponent('time-picker', 'Integration | Component | time picker',
{
  integration: true,

  setup()
  {
    App = startApp();
  },

  teardown()
  {
    run(App, 'destroy');
  }
});

test('time-picker renders', function(assert) {

  this.render(hbs`{{time-picker selectedTime="5:00 AM" defaultToNow=false}}`);

  assert.equal(this.$('DIV').hasClass('time-picker'), true);
  assert.equal(this.$('DIV DIV SPAN').html(), '5:00 AM');
});
/* jshint ignore:end */
