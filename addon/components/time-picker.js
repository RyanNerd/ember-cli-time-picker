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
    '11:30 PM'
  ];

/**
 * @description Implement power-select as an addon for the single purpose of selecting from a list of times.
 * @see http://www.ember-power-select.com/
 */
export default Component.extend(
{
  layout: layout,

  /**
   * Component to render for each time element.
   * @property {string}
   * @public
   */
  timeComponent: 'time-element',

  /**
   * Component to render for the trigger (corresponds to the selectedItemComponent in power-select)
   * @property {string}
   * @public
   */
  selectedTimeComponent: 'selected-time',

  /**
   * List of times to choose from (corresponds to the options property in power-select).
   * @property {string[] | null}
   * @public
   */
  times: null,

  /**
   * The currently selected time (if not null it should be set to an element in the times[] property).
   * @property {string | null}
   * @public
   */
  selectedTime: null,

  /**
   * If selectedTime === null and defaultTimeToNow is true then the current clock time will be used.
   * defaultTimeToNow is ignored if selectedTime !==null
   * @property {boolean}
   * @public
   */
  defaultTimeToNow: true,

  /**
   * When set to true then military time format will be used (Only applies if the times[] array is generated).
   * @property {boolean}
   * @public
   */
  military: false,

  /**
   * Indicates the number of minute intervals. If not specified 30 will be used.
   * @property {int | null}
   * @public
   * @default 30
   */
  increment: null,

  /**
   * Indicates the beginning hour in the picklist. If not set then 1 will be used.
   * @property {int | null}
   * @public
   * @default 1
   */
  startTimeHour: null,

  /**
   * Indicates the ending hour in the picklist. If not set the 24 is the default.
   * @property {int | null}
   * @public
   * @default 24
   */
  endTimeHour: null,

  /*******************************************
   * START: Power-select property pass-through
   *******************************************/

  /**
   * When true the time can be cleared by clicking [x]
   * @property {boolean}
   * @public
   */
  allowClear: true,

  /**
   * The CSS class of the power-select component.
   * @property {string | null}
   * @public
   */
  class: null,

  /**
   * Id of the element used as target for the dropdown's content, when not rendered in place.
   * @property {string | undefined}
   * @public
   */
  destination: undefined,

  /**
   * Indicates if the component is disabled or not.
   * @property {boolean}
   * @public
   */
  disabled: false,

  /**
   * CSS class applied to the dropdown only.
   * @property {string | null}
   * @public
   */
  dropdownClass: null,

  /**
   * When true the component is rendered initially in the open state.
   * @property {boolean}
   * @public
   */
  initiallyOpened: false,

  /**
   * The default message displayed when searching for a time and the search has no match
   * in the times array.
   * @property {string}
   * @public
   */
  noMatchesMessage: "No matching time found",

  /**
   *  Text to show when no time has been selected.
   *  @property {string}
   *  @public
   */
  placeholder: "",

  /**
   * When truthy, the list of options will be rendered in place instead of being attached to the root of the body and
   * positioned with javascript.Enabling this option also adds a wrapper div around the trigger and the content with
   * class .ember-power-select.
   * @property {boolean}
   * @public
   */
  renderInPlace: false,

  /**
   * Indicates if the search box is enabled.
   * @property {boolean}
   * @public
   */
  searchEnabled: true,

  /**
   * Component to be rendered as placeholder. It can be used along with placeholder and has access to it.
   * @property {string | undefined}
   * @public
   */
  placeholderComponent: undefined,

  /**
   * The component to render instead of the default one inside the trigger.
   * @property {string | undefined}
   * @public
   */
  triggerComponent: undefined,

  /**
   * Power-select pass-through - The id to be applied to the trigger.
   * Useful link the select to a <label> tag.
   * @property {string}
   * @public
   */
  triggerId: "",

  /*****************************************
   * END: Power-select property pass-through
   *****************************************/

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
   * Returns the date object (or the current date) as a string in a "digital clock" format:
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
   * All actions are simply power-select pass-through actions
   * (with the exception of onchange which also updates the selectedTime property).
   * @see http://www.ember-power-select.com/docs/api-reference
   */
  actions:
  {
    /**
     * Invoked when component or any of its subitems looses the focus.
     * The last argument is the FocusEvent, that can be used to disambiguate what gained the focus.
     * @param select
     * @param e
     */
    onblur(select, e)
    {
      this.sendAction('onblur', select, e);
    },

    /**
     * Invoked when the user selects an option.
     * Two-way binding is established by setting the selectedTime property when a new selection is made.
     * @param {string | null } value
     */
    onchange(value)
    {
        this.set('selectedTime', value);
        this.sendAction('onchange', value);
    },

    /**
     * Invoked when the component is closed.
     * @param select
     * @param e
     */
    onclose(select, e)
    {
      this.sendAction('onclose', select, e);
    },

    /**
     * Invoked when the component gets focus.
     * @param select
     * @param e
     */
    onfocus(select, e)
    {
      this.sendAction('onfocus', select, e);
    },

    /**
     * Invoked when the user changes the text in any any search input of the component.
     * If the function returns false the default behaviour (filter/search) is prevented.
     * @param select
     * @param e
     */
    oninput(select, e)
    {
      this.sendAction('oninput', select, e);
    },

    /**
     * Invoked when the user presses a key being the component or the inputs inside it focused.
     * @param dropdown
     * @param e
     */
    onkeydown(dropdown, e)
    {
        this.sendAction("onkeydown", dropdown, e);
    },

    /**
     * Invoked when the component is opened.
     * @param select
     * @param e
     */
    onopen(select, e)
    {
        this.sendAction('onopen', select, e);
    }
  }
});
