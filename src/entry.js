import Vue from 'vue'

/* NOT ON SERVER SIDE ...
import './style.scss'
*/

import store from './store'

import moment from 'moment-timezone'
moment.tz.setDefault('UTC') // set default time on browser

Object.defineProperty(Vue.prototype, '$moment', { get() { return this.$root.moment } } )

import App from './components/App.vue'


// /SRC/ENTRY.JS:
export default function(mockDataEventsAsMomentObjectsFromGlobalVar) { // TODO WR__ hmm, what "events" exactly ?? (I have such weird long var names for my WR__ events, 'cha-know


    let initialState = Object.assign({}, store.state, { mockDataEventsAsMomentObjectsFromGlobalVar: mockDataEventsAsMomentObjectsFromGlobalVar })

    /* *************** */
// With the above, we now have a complete "initialState" to replace onto the Store's state:
    store.replaceState(initialState) // <<<<<<< N.B. !!!
    /* *************** */

/* ORIGINAL:
    new Vue({
*/
// NOW: "return" this new Vue component:
    return new Vue({

/*  NOT USED FOR SERVER!
        el: '#app',
*/
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
        store, // << Newfangled ES6 grooviness
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
        // LESSON 168 - RENDER
        /*
         What we are replacing over in INDEX.HTML:
         <div id="app">
         <my-app></my-app>
         </div>
         */
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
            /*
             myVNode:
             children: [
             componentInstance: Object { _uid: 3 ... }
             tag: "vue-component-1-my-app"
             ]
             data: { attrs: Object: { id: "app" } }
             tag: "div"
             */

            return myVNode
        }
    });

}