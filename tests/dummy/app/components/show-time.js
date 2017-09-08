import Component from '@ember/component';
import layout from '../templates/components/show-time';

export default Component.extend({
  layout: layout,
  timeSelected: null,
  time: null,

  timeSelected2: null,
  time2: null,

  actions:
  {
    onChange(value)
    {
        this.set('time', value);
    },

    onChange2(value)
    {
      this.set('time2', value);
    },
  }
});
