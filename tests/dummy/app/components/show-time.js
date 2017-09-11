import Component from '@ember/component';
import layout from '../templates/components/show-time';

export default Component.extend({
  layout: layout,
  timeSelected: null,
  time: null,

  timeSelected2: null,
  time2: null,

  customTimeSelectedEventValue: null,
  customTimeSelected: null,
  customTimes:
    [
      "8:00 AM",
      "9:00 AM",
      "9:15 AM",
      "9:30 AM",
      "9:45 AM",
      "10:00 AM",
      "10:15 AM",
      "10:30 AM",
      "10:45 AM",
      "11:00 AM",
      "11:15 AM",
      "11:30 AM",
      "11:45 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM"
    ],

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

    onChange3(value)
    {
      this.set('customTimeSelectedEventValue', value);
    }
  }
});
