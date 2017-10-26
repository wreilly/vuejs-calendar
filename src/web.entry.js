import Vue from 'vue'

// Sort of hard-coded bringing it in now; Webpack will be taking care of this, & Etc.
import './style.scss'

// LESSON 142 now in its own file ... /store/index.js ... LESSON 138 - VUEX!
/*
import Vuex from 'vuex'
Vue.use(Vuex)
*/

// All 3 work:
// import store from './store/index.js'
// import store from './store/index'
import store from './store'
// console.log('store is ! ? ', store) // yeah, Vuex Store Object etc.
// No: console.log(store.state.currentYear) // undefined

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

// LESSON 164
/* Super(-duper)-seded by that ol' Global Var (out on Index.html)! (of Lesson 165):

let mockDataEventsFromInitialState = [
    // from /store/index.js where it was hard-coded in mockDataEventsFromStore
    // See also use in CalendarDay.vue
    { description: 'yeah 0', wr__date: moment().subtract(1, 'month') },
    { description: 'yeah 1', wr__date: moment() },
    { description: 'yeah 2', wr__date: moment().add(1, 'day') },
    { description: 'yeah 2.A', wr__date: moment().add(1, 'day') },
    { description: 'yeah 3', wr__date: moment().add(10, 'day') }
]
*/

// We grab everything in the Store's state (which, btw, does *not* now include any "mockDataEvents"), and we proceed to additionally add (redundantly redundant) our new just created (above) array of mocked up data events:
/*
let initialState = Object.assign({}, store.state, { mockDataEventsFromInitialState })
*/
// LESSON 165
// N.B. Over in Index.html, we just supply STRINGS (for dates)
// They are NOT "Moment" objects. (e.g. .isSame() doesn't work)
// So: we map() that array to get a new array with Moment objs:

console.log('huhBEFORE. window.__INITIAL_STATE__[0].wr__date: ? ', window.__INITIAL_STATE__[0].wr__date) // << simple date string = ok
// console.log('huhBEFORE. window.__INITIAL_STATE__[0].wr__date.isSame(moment()): ? ', window.__INITIAL_STATE__[0].wr__date.isSame(moment())) // << ERROR ".isSame() not a function" = ok

/* WR__01 first code. changes wr__date from string to Moment object. Hmm. Not intended.
let mockDataEventsAsMomentObjectsFromGlobalVar = window.__INITIAL_STATE__.map(function(eachEvent) {
    let momentizedDate = moment(eachEvent.wr__date)

    eachEvent.wr__date = momentizedDate // <<<<<<<< Here is where it happens. We whamma the newly created Moment object *back onto* our original Array's element: "eachEvent"'s .wr__date property. sigh.

    return eachEvent
})
*/
/*
// Hah. My code above ("WR__01") DOES cause the window initial state date to BECOME A MOMENT OBJECT.
// I thought it would leave the original array (and its contents!) unchange.
// Bit naive I guess!!!
console.log('huhAFTER WR__01. window.__INITIAL_STATE__[0].wr__date: ? ', window.__INITIAL_STATE__[0].wr__date) // << Object { _isAMomentObject: true ... }
console.log('huhAFTER WR__01. window.__INITIAL_STATE__[0].wr__date.isSame(moment()): ? ', window.__INITIAL_STATE__[0].wr__date.isSame(moment())) // false (not same as today = ok)
*/


/* WR__02 second code. try to *NOT* change wr__date on original array. Let's see.
* YES. This did work.
* The 'wr__date' on the window original array REMAINS a String. Bon. */
let mockDataEventsAsMomentObjectsFromGlobalVar = window.__INITIAL_STATE__.map(function(eachEvent) {
    let eventIReturn = {}
    let momentizedDate = moment(eachEvent.wr__date)
    eventIReturn.wr__date = momentizedDate // <<<<< Better. Put Moment object on *new* Event object, to be returned to the *new* array (leave original window array UNCHANGED)
    eventIReturn.description = eachEvent.description
    return eventIReturn
})
console.log('huhAFTER WR__02. window.__INITIAL_STATE__[0].wr__date: ? ', window.__INITIAL_STATE__[0].wr__date) // << remains simple date string = ok, good!
/*
console.log('huhAFTER WR__02. window.__INITIAL_STATE__[0].wr__date.isSame(moment()): ? ', window.__INITIAL_STATE__[0].wr__date.isSame(moment())) // << ERROR ".isSame() not a function" = ok, good!
*/

/* INSTRUCTOR CODE: (cleaner!)
let events = window.__INITIAL_STATE__.map(event => {
   return {
      description: event.description,
      date: moment(event.date) // <<<< Instructor returns anonymous new object. Bon.
    }
}
 */



console.log('Whoa. mockDataEventsAsMomentObjectsFromGlobalVar: ', mockDataEventsAsMomentObjectsFromGlobalVar)

console.log('Whoa2. window.__INITIAL_STATE__: ', window.__INITIAL_STATE__)

/*
let initialState = Object.assign({}, store.state, { mockDataEventsFromGlobalVar: window.__INITIAL_STATE__ })
*/

// LESSON 165: ???
/* Q. Works ??? But, I don't get it ??? See next line ... */
/* A. O.K. "Broke the code." See above.
     * My "WR__01" code was MODIFYING the initial window global variable,
      * which was *not* my intention o well.
      * WR__02 fixes that. Cheers. */
// Now this next line No Longer "Works" = Good.
/*
let initialState = Object.assign({}, store.state, { mockDataEventsAsMomentObjectsFromGlobalVar: window.__INITIAL_STATE__ })
*/


/* Works. :o) */
let initialState = Object.assign({}, store.state, { mockDataEventsAsMomentObjectsFromGlobalVar: mockDataEventsAsMomentObjectsFromGlobalVar })



/* *************** */
// With the above, we now have a complete "initialState" to replace onto the Store's state:
store.replaceState(initialState) // <<<<<<< N.B. !!!
/* *************** */

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
    },
    store // << Newfangled ES6 grooviness
    // store: store // << old-fashioned ES5

    // VUEX STORE: LESSON 142
/*  NOW in /store/index.js
    store: {
      state: {
          currentYear: 2017,
          currentMonth: 10
      }
    }
*/
});
