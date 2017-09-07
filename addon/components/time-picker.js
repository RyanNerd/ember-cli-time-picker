import Component from '@ember/component';
import layout from '../templates/components/time-picker';

import { assert } from '@ember/debug';

/**
 * @constant
 * @type {string[]}
 */
const DEFAULT_TIMES =
  [
    '1:00 AM',
    '1:30 AM',
    '2:00 AM',
    '2:30 AM',
    '3:00 AM',
    '3:30 AM',
    '4:00 AM',
    '4:30 AM',
    '5:00 AM',
    '5:30 AM',
    '6:00 AM',
    '6:30 AM',
    '7:00 AM',
    '7:30 AM',
    '8:00 AM',
    '8:30 AM',
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:30 AM',
    '12:00 AM',

    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
    '11:30 PM',
    '12:30 PM',
    '12:00 PM'
  ];

export default Component.extend(
{
  layout: layout,

  /**
   * @description List of times to choose from.
   * @property
   * @private
   * @type string[]
   */
  times: DEFAULT_TIMES,

  /**
   * @description The currently selected time.
   * @property
   * @public
   * @type {string}|{null}
   */
  selectedTime: null,

  /**
   * @description If no time is bound and defaultTimeToNow is true then the current clock time will be used.
   * @property
   * @public
   * @type {boolean}
   */
  defaultTimeToNow: true,

  /**
   * @description When set to true military time format will be used.
   * @property
   * @public
   * @type {boolean}
   * @todo Implement
   */
  military: false,

  /**
   * @description Indicates the number of minute intervals
   * @property
   * @type {int}
   * @todo Implement
   */
  increment: 30,

  /**
   * @description Indicates the beginning hour in the picklist
   * @property
   * @type {int}
   * @todo Implement
   */
  startTimeHour: 0,

  /**
   * @description Indicates the ending hour in the picklist.
   * @property
   * @type {int}
   * @todo Implement
   */
  endTimeHour: 24,

  /**
   * @description Power-select property pass-through indicating that the time can be cleared by clicking [x]
   * @property
   * @public
   * @type {boolean}
   */
  allowClear: true,

  /**
   * @description Power-select property pass-though indicating if the component is disabled or not.
   * @property
   * @public
   * @type {boolean}
   */
  disabled: false,

  /**
   * @description Default message displayed when searching for a time and the search has no match in the times array.
   * @property
   * @public
   * @type {string}
   */
  noMatchesMessage: "No matching time found",

  /**
   * @description Default the search box as enabled (Power-select pass-through)
   * @property
   * @public
   * @type {boolean}
   */
  searchEnabled: true,

  /**
   * @description Fires prior to inserting the component into the DOM
   * @todo If increment is !== 30 then generate times.
   * @todo If startTimeHour != 0 then generate times.
   * @todo If endTimeHour != 24 then generate times.
   * @todo Override times with an array of military times if military === true
   */
  init()
  {
    this._super(...arguments);

    // Is defaultTimeToNow true and the selectedTime not set?
    if (this.get('selectedTime') === null && this.get('defaultTimeToNow')) {
      /**
       * @type {string[]}
       */
      let times = this.get('times'); // Get the array of acceptable times

      /**
       * @type {Date}
       */
      let time = new Date(); // Get a Date object set to "now"

      /**
       * @type {number}
       */
      let minutes = time.getMinutes(); // Get the minutes value from "now"

      /**
       * Prevent an endless loop with this flag.
       * @type {boolean}
       */
      let minuteFlag = false;

      /**
       * Look for a valid time in the times array and adjust minutes until we find one
       * or set it to null if no match found.
       */
      while(!times.includes(this.getFormattedTime(time))) {
        minutes++;
        if (minutes > 59) {
          if (!minuteFlag) {
            minuteFlag = true;
            minutes = 0;
          } else {
            time = null;
            break;
          }
        }
        time.setMinutes(minutes);
      }

      assert('Unable to calculate a valid time for "now".', time !== null);

      // Since we calculated the time we fake an onchange action to bubble up the event to update the bound  property.
      this.send('onchange', this.getFormattedTime(time));
    }
  },

  /**
   * Fires when the component is inserted into the DOM.
   */
  didInsertElement()
  {
    // If selectedTime has been overridden/calculated we need to tell power-select about it.
    if (this.get('selectedTime') !== null) {
      // We can't do this in the init() because power-select has not been loaded into the DOM yet.
      this.notifyPropertyChange('selectedTime');
    }
  },

  /**
   * @description Returns the date object (or the current date) as a string in a "digital clock" format:
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates
   * @param {[Date]} date Date object; if not provided the current date/time will be used.
   * @returns {string} The date as a string in a "digital clock" format (ex: 12:08 PM, 3:14 AM).
   */
  getFormattedTime(date = null)
  {
    assert('Invalid type. "date" must be either null or a Date type.', date === null || date instanceof Date);

    let time;
    if (date) {
        time = date;
    } else {
      time = new Date();
    }
    let hour = time.getHours();
    let minute = time.getMinutes();
    // let second = time.getSeconds();
    let temp = '' + ((hour > 12) ? hour - 12 : hour);
    if (hour === 0) {
        temp = '12';
    }
    temp += ((minute < 10) ? ':0' : ':') + minute;
    temp += (hour >= 12) ? ' PM' : ' AM';
    return temp;
  },

  /**
   * @description Power-select pass-through actions
   * (with the exception of onchange which also updates the selectedTime property).
   */
  actions:
  {
    /**
     * @description Two-way binding is established by setting the selectedTime property when a new selection is made.
     * @param {string | null } value
     */
    onchange(value)
    {
        this.set('selectedTime', value);
        this.sendAction('onchange', value);
    },

    onkeydown(dropdown, e)
    {
        this.sendAction("onkeydown", dropdown, e);
    },

    onfocus(select, e)
    {
        this.sendAction('onfocus', select, e);
    },

    onblur(select, e)
    {
        this.sendAction('onblur', select, e);
    },

    onopen(select, e)
    {
        this.sendAction('onopen', select, e);
    },

    onclose(select, e)
    {
        this.sendAction('onclose', select, e);
    }
  }
});
