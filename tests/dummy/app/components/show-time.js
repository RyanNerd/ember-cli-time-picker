import Component from '@ember/component';
import layout from '../templates/components/show-time';

export default Component.extend({
    layout: layout,
    timeSelected: null,
    time: null,

    actions:
    {
        onChange(value)
        {
            this.set('time', value);
        }
    }
});
