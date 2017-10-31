// LESSON 171
// SSR - Server-Side Rendering
// We REFACTOR much of this OUT of WEB.ENTRY.JS to ENTRY.JS

/*  LESSON 171 NO LONGER NEEDED:
 import Vue from 'vue'
 */

import './style.scss'

/* LESSON 171 NOT USED HERE:
import store from './store'
*/

import moment from 'moment-timezone'
moment.tz.setDefault('UTC') // set default time on browser

/*
import App from './components/App.vue'
*/


/*
 Here in WEB.ENTRY.JS we have wr__dates that are just Strings.
 Need to "Momentize()" (like we do in WEB.ENTRY.JS and NODE.ENTRY.JS and /STORE.INDEX.JS)
 https://www.udemy.com/vuejs-2-essentials/learn/v4/questions/2304096
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

// The "root" component is *not named* over in entry.js
// I have named it here (for my purposes)
// This next line is in BOTH WEB.entry.js AND NODE.entry.js
import MyVueCalendar from './entry'

// LESSON 175
setTimeout(function() {
// $mount Instance Method.
        MyVueCalendar(mockDataEventsAsMomentObjectsFromGlobalVar)
            .$mount('#app')
    }, 2000
)



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
    render(createElement) { // << Server-Side Rendering (SSR)
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
