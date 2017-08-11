import Ember from 'ember';
import layout from '../templates/components/time-picker';

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
        '12:30 PM',
        '12:00 PM'
    ];

export default Ember.Component.extend(
{
    layout: layout,

    /**
     * List of times to choose from.
     *
     * {array} {string} times[]
     */
    times: DEFAULT_TIMES,

    /**
     * {string}|{null} The currently selected time.
     */
    selectedTime: null,

    /**
     * {bool} If no time is bound and defaultTimeToNow is true then the current clock time will be used.
     */
    defaultTimeToNow: true,

    /**
     * {bool} When set to true military time format will be used.
     * TODO: Implement
     */
    military: false,

    /**
     * {int} Indicates the number of minute intervals
     * TODO: Implement
     */
    increment: 30,

    /**
     * {int} Indicates the beginning hour in the picklist
     * TODO: Implement
     */
    startTimeHour: 0,

    /**
     * {int} Indicates the ending hour in the picklist
     * TODO: Implement
     */
    endTimeHour: 24,

    /**
     * {bool} Power-select property pass-through indicating that the time can be cleared by clicking [x]
     */
    allowClear: true,

    /**
     * {string} Power-select property pass-through
     * @see http://www.ember-power-select.com/docs/the-list
     */
    destination: "",

    /**
     * {bool} Power-select property pass-though indicating if the component is disabled or not.
     */
    disabled: false,

    /**
     * {bool} Power-select property pass-through (usually set to true if the component is in a modal)
     * @see http://www.ember-power-select.com/docs/the-list
     */
    renderInPlace: false,

    /**
     * {string} default message displayed when searching for a time and the search has no match in the times array.
     */
    noMatchesMessage: "No matching time found",

    /**
     * {bool} default the search box as enabled (Power-select pass-through)
     */
    searchEnabled: true,

    init()
    {
        this._super(...arguments);

        // TODO: if increment is !== 30 then generate times.
        // TODO: if startTimeHour != 0 then generate times.
        // TODO: if endTimeHour != 24 then generate times.
        // TODO: Override times with an array of military times if military === true
    },

    /**
     * Change the selectedTime if the initial value is null and defaultTimeToNow is true.
     *
     * (Thankfully Ember doesn't pitch a fit when changing properties in this event.)
     */
    didInsertElement()
    {
        let selectedTime = this.get('selectedTime');

        // Is defaultTimeToNow true and the selectedTime not set?
        if (selectedTime === null && this.get('defaultTimeToNow')) {
            let times = this.get('times'); // Get the array of acceptable times
            let time = new Date(); // Get a Date object set to "now"
            let minutes = time.getMinutes(); // Get the minutes value from "now"
            let minuteFlag = false; // Prevent an endless loop with this flag.

            // Look for a valid time in the times array and adjust minutes until we find one
            // or set it to null if no match found.
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

            // If we found a valid time in the times array then set the selectedTime to that string value,
            // otherwise set the selectedTime to null.
            // TODO: Throw error instead if not found?
            if (time !== null) {
                selectedTime = this.getFormattedTime(time);
            } else {
                selectedTime = null;
            }
            this.set('selectedTime', selectedTime);
        }
    },

    /**
     * Returns the date object (or the current date) as a string in a "digital clock" format:
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates
     * @param {Date} date (optional) Date object; if not provided the current date/time will be used.
     * @returns {string} The date as a string in a "digital clock" format (ex: 12:08 PM, 3:14 AM).
     */
    getFormattedTime(date = null)
    {
        if (date !== null && !(date instanceof Date)) {
            throw 'Invalid type. `date` must be either null or a Date type.';
        }

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
        // temp += ((second < 10) ? ':0' : ':') + second;
        temp += (hour >= 12) ? ' PM' : ' AM';
        return temp;
    },

    // Power-select pass-through actions (with the exception of onchange which updates the selectedTime property).
    actions:
    {
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