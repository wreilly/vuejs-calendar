import Vue from 'vue'

// Sort of hard-coded bringing it in now; Webpack will be taking care of this, & Etc.
import './style.scss'

import moment from 'moment-timezone'
moment.tz.setDefault('UTC') // set default time on browser
/*
Make "Moment.JS" object available as a defined property on our Vue instance,
via prototype definition.
Put a "getter()" on that returns the moment object from here off the "$root".
And make that available in the data: {} part of our Vue instance. Hmm.
Tres bien.
 */
Object.defineProperty(Vue.prototype, '$moment', { get() { return this.$root.moment } } )

import App from './components/App.vue'

new Vue({
  el: '#app',
  data: {
      msg: 'Hello World from web.entry.js',
      moment
      /* could be: (a) moment: moment, or, (b) 'my-moment': moment ...
        (although if (b) you'd have to change other things too...) */
  },
    components: {
    /*
    Recall: All these work:
    App
    App: App
    app: App
    And remember: regardless of which line above you use,
    VueJS automagically makes a lower-cased
    version of your Component name available for insertion
    into your <template> as an element.
    <app></app>

    As for hyphenated, don't forget those quotes!
     E.g.
     'day-select': DaySelect,
     <day-select></day-select>
     Very nice.

     Finally, we see the Component in the Vue DevTools as
     (automagically) back to CamelCaseFirstCap:
     <MyApp>
     Interesting.
     */
    'my-app': App
    }
});
