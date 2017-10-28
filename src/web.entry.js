/*  LESSON 171 NO LONGER NEEDED:
import Vue from 'vue'
*/

// LESSON 171
// SSR - Server-Side Rendering
// We REFACTOR much of this OUT of WEB.ENTRY.JS to ENTRY.JS

// Sort of hard-coded bringing it in now; Webpack will be taking care of this, & Etc.
import './style.scss'


/* LESSON 171 NOT USED HERE:
import store from './store'
*/


import moment from 'moment-timezone'
moment.tz.setDefault('UTC') // set default time on browser


/*
import App from './components/App.vue'
*/



let mockDataEventsAsMomentObjectsFromGlobalVar = window.__INITIAL_STATE__.map(function(eachEvent) {
    let eventIReturn = {}
    let momentizedDate = moment(eachEvent.wr__date)
    eventIReturn.wr__date = momentizedDate // <<<<< Better. Put Moment object on *new* Event object, to be returned to the *new* array (leave original window array UNCHANGED)
    eventIReturn.description = eachEvent.description
    return eventIReturn
})
console.log('huhAFTER WR__02. window.__INITIAL_STATE__: ? ', window.__INITIAL_STATE__) // << Now from server, our initial array is EMPTY (no dummy entries). So don't go asking for the "[0]th" element!


console.log('Whoa. mockDataEventsAsMomentObjectsFromGlobalVar: ', mockDataEventsAsMomentObjectsFromGlobalVar)

console.log('Whoa2. window.__INITIAL_STATE__: ', window.__INITIAL_STATE__)

// The component is *not named* over in entry.js
// I have named it here (for my purposes)
import MyVueCalendar from './entry'

// $mount Instance Method.
MyVueCalendar(mockDataEventsAsMomentObjectsFromGlobalVar)
    .$mount('#app')


/*
let initialState = Object.assign({}, store.state, { mockDataEventsFromGlobalVar: window.__INITIAL_STATE__ })
*/


/*  *** LESSON 171  ********* REFACTORED TO ENTRY.JS ****************
/!* Works. :o) *!/
let initialState = Object.assign({}, store.state, { mockDataEventsAsMomentObjectsFromGlobalVar: mockDataEventsAsMomentObjectsFromGlobalVar })
*/


/*  *** LESSON 171  ********* REFACTORED TO ENTRY.JS **************** */
/*
/!* *************** *!/
// With the above, we now have a complete "initialState" to replace onto the Store's state:
store.replaceState(initialState) // <<<<<<< N.B. !!!
/!* *************** *!/
*/


/*  *** LESSON 171  ********* REFACTORED TO ENTRY.JS **************** */
/*
new Vue({
  el: '#app',
  data: {
      msg: 'Hello World from web.entry.js',
      moment
      /!* could be: (a) moment: moment, or, (b) 'my-moment': moment ...
        (although if (b) you'd have to change other things too...) *!/
  },
    components: {
    'my-app': App
    },
    store, // << Newfangled ES6 grooviness
    render(createElement) {
         let myVNode = createElement(
            'div',
            { attrs: { id: 'app'} },
            [
                createElement(
                    'my-app' // << No 2nd nor 3rd arguments
                )
            ]
        )
        console.log('myVNode: ', myVNode)
        return myVNode
    }
});
*/
