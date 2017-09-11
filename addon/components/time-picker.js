import Component from '@ember/component';
import layout from '../templates/components/time-picker';

// assert and warn calls are NOT included as executable code when distributing to production.
import { assert, warn } from '@ember/debug';

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

/**
 * @description Implement power-select as an addon for the single purpose of selecting from a list of times.
 * @see http://www.ember-power-select.com/
 */
export default Component.extend(
{
  layout: layout,

  /**
   * @description List of times to choose from.
   * @property
   * @public
   * @type {string[] | null}
   */
  times: null,

  /**
   * @description The currently selected time (if not null it should be set to an element in the times[] property).
   * @property
   * @public
   * @type {string | null}
   */
  selectedTime: null,

  /**
   * @description If selectedTime===null and defaultTimeToNow is true then the current clock time will be used.
   *              defaultTimeToNow is ignored if selectedTime !==null
   * @property
   * @public
   * @type {boolean}
   */
  defaultTimeToNow: true,

  /**
   * @description When set to true military time format will be used (Only applies if the times[] array is generated).
   * @property
   * @public
   * @type {boolean}
   */
  military: false,

  /**
   * @description Indicates the number of minute intervals
   * @property
   * @public
   * @type {int | null}
   * @default 30
   */
  increment: null,

  /**
   * @description Indicates the beginning hour in the picklist
   * @property
   * @public
   * @type {int | null}
   * @default 1
   */
  startTimeHour: null,

  /**
   * @description Indicates the ending hour in the picklist.
   * @property
   * @public
   * @type {int | null}
   * @default 24
   */
  endTimeHour: null,

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
   * This fires prior to inserting the component into the DOM
   */
  init()
  {
    this._super(...arguments);

    // Cache properties we will be working with.
    let increment = this.get('increment');
    let startTimeHour = this.get('startTimeHour');
    let endTimeHour = this.get('endTimeHour');
    let times = this.get('times');
    let military =this.get('military');

    // If increment, startTimeHour, or endTimeHour is set then we calculate the times array.
    if (increment !== null || startTimeHour !== null || endTimeHour !== null) {
      // Set defaults for unset properties
      if (increment === null) {
        increment = 30;
      }
      if (startTimeHour === null) {
        startTimeHour = 1;
      }
      if (endTimeHour === null) {
        endTimeHour = 24;
      }

      // Cast increment, startTimeHour, and endTimeHour to int.
      increment = parseInt(increment);
      startTimeHour = parseInt(startTimeHour);
      endTimeHour = parseInt(endTimeHour);

      // For debugging
      assert('time-picker: The increment property can not be <= 0.', increment > 0);
      assert('time-picker: The increment property can not be > 59.', increment <= 59);
      if (military === true) {
        assert('time-picker: The startTimeHour property can not be < 0.', startTimeHour >= 0);
        assert('time-picker: The endTimeHour property can not be < 0.', endTimeHour >= 0);
      } else {
        assert('time-picker: The startTimeHour property can not be < 1.', startTimeHour >= 1);
        assert('time-picker: The endTimeHour property can not be < 1.', endTimeHour >= 1);
      }
      assert('time-picker: The startTimeHourProperty can not be > 24.', startTimeHour <= 24);
      assert('time-picker: The endTimeHourProperty can not be > 24.', endTimeHour <= 24);
      assert('time-picker: The startTimeHour can not be > endTimeHour.', startTimeHour <= endTimeHour);

      // Calculate the times[]
      times = [];
      for (let hour = startTimeHour; hour <= endTimeHour; hour++) {
        let amPm = "";
        let actualHour = this.zeroPad(hour, 2);

        // If NOT using military time then include AM/PM and change the actualHour to modulo 12 and drop leading zeros.
        if (military === false) {
          amPm = (hour > 12) ? ' PM' : ' AM';
          actualHour = (hour > 12) ? hour - 12 : hour;
          actualHour = actualHour.toString();
        }

        let minutes = 0;
        while (minutes <=59) {
          // Push the calculated time into the array.
          times.push(actualHour + ':' + this.zeroPad(minutes, 2) + amPm);

          // Increment the minutes.
          minutes += increment;
        }
      }
    }

    // If the times[] are not set then use the default.
    if (times === null) {
      times = DEFAULT_TIMES;
    }

    this.set('times', times);

    assert('time-picker: The times property must be a string array with at least one element.',
      times.length !== 0 && typeof times[0] === 'string');

    let selectedTime = this.get('selectedTime');

    // Is defaultTimeToNow true and the selectedTime not set?
    if (selectedTime === null && this.get('defaultTimeToNow') === true) {
      // Get a Date object set to "now"
      let time = new Date();

      // Get the minutes value for "now"
      let minutes = time.getMinutes();

      // Prevent an endless loop with this flag.
      let minuteFlag = false;

      /**
       * Look for a valid time in the times array and adjust minutes until we find one
       * or set it to null if no match found.
       */
      while(!times.includes(this.getFormattedTime(time))) {
        minutes++;
        if (minutes > 59) {
          minutes = 0;
          if (!minuteFlag) {
            minuteFlag = true;

            // Try incrementing the hour by one % 24 (because of the minuteFlag we only do this once).
            let hours = time.getHours();
            if (hours < 24) {
              time.setHours(++hours);
            } else {
              time.setHours(0);
            }
          } else {
            break;
          }
        }
        time.setMinutes(minutes);
      }

      // Was a valid time of "now" in the times array?
      if (time !== null) {
        // Since we calculated the selectedTime we fake an onchange action to bubble up the event.
        this.send('onchange', this.getFormattedTime(time));
      }
    }

    // If allowClear is false and selectedTime is null then default selectedTime to times[0].
    if (selectedTime === null && this.get('allowClear') === false) {
      this.send('onchange', times[0]);
    }

    // If the selectedTime is not null warn if the selectedTime is not in the times[] array.
    if (selectedTime !== null) {
      warn('time-picker: Invalid selectedTime: ' + selectedTime, times.includes(selectedTime), {"id" : "ember-cli-time-picker"});
    }
  },

  /**
   * This fires when the component is inserted into the DOM.
   */
  didInsertElement()
  {
    // If selectedTime is set/overridden/calculated we need to tell power-select about it.
    if (this.get('selectedTime') !== null) {
      // We can't do this in the init() because power-select has not been loaded into the DOM yet.
      try {
        this.propertyWillChange('selectedTime');
        this.propertyDidChange('selectedTime');
      } catch (e) {
        // Ugly work-around by setting selectedTime to itself.
        this.set('selectedTime', this.get('selectedTime'));
      }
    }
  },

  /**
   * @description Returns the date object (or the current date) as a string in a "digital clock" format:
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates
   * @param {Date | null} date Date object; if not provided the current date/time will be used.
   * @returns {string} The date as a string in a "digital clock" format (ex: 12:08 PM, 3:14 AM).
   */
  getFormattedTime(date = null)
  {
    assert('time-picker: Invalid type, the date argument must be either null or a Date type.',
      date === null || date instanceof Date);

    let time;
    if (date) {
        time = date;
    } else {
      time = new Date();
    }
    let hour = time.getHours();
    let minute = time.getMinutes();
    let temp = '' + ((hour > 12) ? hour - 12 : hour);
    if (hour === 0) {
        temp = '12';
    }
    temp += ((minute < 10) ? ':0' : ':') + minute;
    temp += (hour >= 12) ? ' PM' : ' AM';
    return temp;
  },

  /**
   * Add leading zeros to a number returning the zero padded number as a string.
   * @param {number} num The number to pad with zeros.
   * @param {int} places Number of digits of the number to have leading zeros.
   * @returns {string}
   */
  zeroPad(num, places) {
    let zero = places - num.toString().length + 1;
    return new Array(+(zero > 0 && zero)).join("0") + num;
  },

  /**
   * @description All actions are power-select pass-through actions
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
