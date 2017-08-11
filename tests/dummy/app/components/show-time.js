import Ember from 'ember';
import layout from '../templates/components/show-time';

export default Ember.Component.extend({
    layout: layout,
    timeSelected: null,

    actions:
    {
        onChange(value)
        {
            console.log(value);
        }
    }
});
