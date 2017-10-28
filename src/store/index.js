import Vue from 'vue'

// LESSON 138 - 142 - Now in its own file: VUEX!
import Vuex from 'vuex'
Vue.use(Vuex)

// Hmm. Necessary? Turns out: Yeah.
// Repeating import we'd done in web.entry.js
// Note that there we did Object.defineProperty to make $moment available on Vue instance components.
// But, here in the Vuex Store, I guess we are not tapped in to that defined Object property, of this.$moment ?
// Okay, so, instead of "this.$moment()" we here simply use "moment()"
import moment from 'moment-timezone'
moment.tz.setDefault('UTC') // set default time on browser

// Seems odd. I thought that good old JavaScript 'this' was
// omni/always-present, and all that jazz. Huh.
// Might have been difficile to know just *what* 'this' is/was, but I didn't expect it to just Not Be There. Hmmph.
// console.log('this in Store is ? ', this) // undefined. Hmm!
// Solution: Don't use it! Drop it off those lines below referencing $moment off of 'this.' So simple. Who knew.
// So: instead of this.$moment, just moment

// LESSON 159
import Axios from 'axios'
// Vue ServerSide Rendering does NOT work with Vue-Resource.
// One reason we go with Axios instead. Cheers.

export default new Vuex.Store({
    strict: true, // ?? https://ypereirareis.github.io/blog/2017/04/25/vuejs-two-way-data-binding-state-management-vuex-strict-mode/

    // store: { // << DUMKOPPF! No need for "store: {}" wrapper around!!! (o la)
        state: {
            currentYear: 2017,
            currentMonth: 10,
            eventFormPosY: 450,
            eventFormPosX: 50,
            eventFormActiveBool: false,

            description: '', //'hi desc from store', // Event text ... Set from EventForm; cleared by CurrentMonth

            highlightEventCalendarDayBool: false, // Concept of "active" - has the user clicked here, on this day, to add event? If so, we'll say true and highlight that day e.g. pink

            /* Interesting.
            Initial default value for this property: eventCalendarDay
             // will be Moment object
            I tried several things as default value, all seemed to work okay.
            BUT, it was only when I tried to use .format() on the result of this, over in EventForm.vue, that I discovered that the only one that works right is:
            = moment()  << Yep.
            Makes sense.
            The others were:
             // Worked: >> '', // Worked: >> null, // Worked: >> {},
             */
            eventCalendarDay: moment(),
            mockDataEventsFromStore:  [ // <<< NOT USED (any mo') (Could comment this out o well.)
                // was in CalendarDay.vue, mocked up
// LESSON 164 Now refactored to "initialState" over in WEB.ENTRY.JS
/*
                // { description: 'yeah 0', wr__date: this.$moment().subtract(1, 'month') },
                { description: 'yeah 0', wr__date: moment().subtract(1, 'month') },
                // get rid of "this.$"
                // Error encountered:
                // "TypeError: Cannot read property '$moment' of undefined"
                { description: 'yeah 1', wr__date: moment() },
                { description: 'yeah 2', wr__date: moment().add(1, 'day') },
                { description: 'yeah 2.A', wr__date: moment().add(1, 'day') },
                { description: 'yeah 3', wr__date: moment().add(10, 'day') }
*/
            ],
            /* Don't forget: mockDataEventsAsMomentObjectsFromGlobalVar << !!

            N.B. LESSON 165, 166, and my "Server Sync!":
            The Vuex Store State gets another property, not seen here in the /STORE/INDEX.JS source code.
            You *can* see it if you do VIEW PAGE SOURCE once you open the app on :3000/index.html

            This object holds all our Events, for the CLIENT app.
            (Note that the /SERVER.JS *also* holds all our Events, on the server side.)
            The SERVER Events object is the source object, the canonical one, the one that 'holds truth'.
            The SERVER Events object will occasionally overwrite the CLIENT Events object.
            The SERVER Events object is created first: It is dynamically generated:
              - 1) first, from /STORE/INDEX.JS (typically as an empty array, or with a token dummy entry), which is "spliced" (template.replace()) into our INDEX.HTML source, and then
              - 2) this array is updated (added to), one Event at a time, by User clicking Add Event, Submit
            The (Local) CLIENT gets this array of Event objects :
             - 1) first, via WEB.ENTRY.JS, reading in "initial state" off the index.html, and then
             - 2) this Local CLIENT array is added to, one Event at a time, by User clicking Add Event, Submit
             The (OTHER) CLIENT gets the "Sync!" version (from Server) of this Array, by:
             - 1) When the User clicks our "!" Sync! button, to move all the On Server Events into this state array on THEIR (Local) Client.  All Events created by any and all various Clients, will ALL be on the Server, and ALL those Events are sent out to any Client/user who does click on "Sync!".
             Bon.

             */
        },
        mutations: {
            setCurrentYear(state, payload) {
                state.currentYear = payload // whamma-jamma
            },
            setCurrentMonth(state, payload) {
                state.currentMonth = payload // whamma-jamma
            },
            assignClickPosY(state, payload) {
                state.eventFormPosY = payload

            },
            assignClickPosX(state, payload) {
                state.eventFormPosX = payload
            },
            eventFormActive(state, payload) {
                state.eventFormActiveBool = payload //whamma-jamma (comme d'habitude)
            },
            highlightEventCalendarDay(state, payload) {
              state.highlightEventCalendarDayBool = payload // boolean
            },
            captureEventCalendarDay(state, payload) {
                state.eventCalendarDay = payload // dayForCDay
            },
            descriptionSet(state, payload) {
                state.description = payload
            },
            saveMyEventMutation(state, payload) {
                console.log('MUTATION payload receieved is ', payload)
                /*
                 payload receieved is
                 Object { description: "lopllop", wr__date: {…} }
                 */


                /* Hmm. Thought I was done. (2017-10-27)
                 My "state" above DOES have an entry for:
                 - mockDataEventsFromStore

                 But, my "state" above has NO ENTRY for:
                - mockDataEventsFromInitialState
                - mockDataEventsFromGlobalVar
                - mockDataEventsAsMomentObjectsFromGlobalVar

                Q. So - why (the H___) don't these next lines hit AN ERROR ??? ???
                A. Nope: I guess (MBU) my code (below) can simply ADD a new thingie (technical term) TO the state, dynamically, and all that jazz. Hmm. ??
                A.2. Yep: Look at the WEB.ENTRY.JS file! We REWRITE the state there, ADDING that mockDataEventsAsMomentObjectsFromGlobalVar

                 */
                console.log('state ', state)
                console.log('state.mockDataEventsAsMomentObjectsFromGlobalVar: ', state.mockDataEventsAsMomentObjectsFromGlobalVar)

/*
                state.mockDataEventsFromStore.push( payload
*/
/*
// LESSON 164:
                state.mockDataEventsFromInitialState.push( payload
*/
/*
// LESSON 165:
                state.mockDataEventsFromGlobalVar.push( payload
*/

// LESSON 165:PART 2 ...
                // *POST* LESSON 166 ... WR__ extra credit = Sync with Server :o)
                // We LEAVE this State property with its same name ("from Global Var") ...
                // ... even though we go on to actually use it, fill it, with data from the Server
                //   (allEventsFromServerAsMomentObjects)
                // That takes place whenever the User clicks to request that "Sync!". Bon.

                state.mockDataEventsAsMomentObjectsFromGlobalVar.push( payload


                    /* Not this:
                    {
                    description: payload,
                    wr__date: eventCalendarDay
                }
Why?
Because our payload is already an object thing.

Instructor Code approach, by comparison:
1. My WR__ code does:
- capture the date from the click on the CalendarDay.vue
- put that date into the Store
- have the EventForm do a computed() property to pick up that date
- send that date from the EventForm as part of the payload object

2. Instructor Code does:
 - (SAME) capture the date from the click on the CalendarDay.vue
 - (SAME) put that date into the Store
 - (DIFFERS) send only the Event Description text as the payload (String)
 - (DIFFERS) get that date directly from right here in the Store to add to the Event being pushed onto the Array

 addEvent(state, payload) {  // << My WR__ 'saveMyEventMutation()'
   state.events.push({
     description: payload,
     date: state.eventFormDate
   })
  },
 eventFormDate(state, payload) {  // << My WR__ 'captureEventCalendarDay()'
     state.eventFormDate = payload
   }


*/
                ) // /.push()


            }, // /SaveMyEventMutation()

            doSyncMutation(state, payload) {
                /*
                Payload is allEventsFromServerAsMomentObjects. Veddy nice.
                 */
 //               state.mockDataEventsAsMomentObjectsFromGlobalVar = [] // empty it out (!) (?)
                state.mockDataEventsAsMomentObjectsFromGlobalVar = payload // whamma-jamma ???
            }
        }, // /mutations: {}
    actions: {

        /*
        In Vuex, ACTIONS get *CONTEXT* (ah-hah!)
        Context is basically our Store.
         */

        addEventAction(context, payload) {
            // LESSON 163 = Putting PROMISE around whole thing:

            return new Promise((resolve, reject) => {
                // refactored from mutation saveMyEventMutation << I improved this name (was "Action" now "Mutation" Bon.)
                console.log('ACTION payload receieved is ', payload)
                console.log('action context is: ', context)
                /*
                 action context is:
                 {…}
                 commit: function boundCommit()
                 dispatch: function boundDispatch()
                 getters: Object {  }
                 rootGetters: Object {  }
                 rootState: Object { currentYear: Getter & Setter, currentMonth: Getter & Setter, eventFormPosY: Getter & Setter, … }
                 state: Object { currentYear: Getter & Setter, currentMonth: Getter & Setter, eventFormPosY: Getter & Setter, … }
                 */

                // Next line commits the Mutation (with now improved name)
                // BEFORE Axios, we just committed mutation right here.
                // NOW we do not do commit till we get back '200 OK' from Axios POST
//            context.commit('saveMyEventMutation', payload)

                // LESSON 159  AXIOS - to server
                // N.B. Do this ASYNC stuff HERE in *Action*, not where I had it, in Mutation. tsk tsk no.

                let objEvent = payload // our payload is already an object (whereas for Instructor it is just a String)
                // We'll use this 'objEvent' for the Axios call, below

                console.log('objEvent payload thing is: ', objEvent)
                /*
                 Huh. Is this what I expected?
                 objEvent payload thing is:
                 {…}
                 __ob__: Object { value: {…}, dep: {…}, vmCount: 0 }
                 description: Getter & Setter
                 <get>: function reactiveGetter()
                 <set>: function reactiveSetter()
                 wr__date: Getter & Setter ...
                 */

                // LESSON 163 PROMISE...
                Axios.post('/add_event', objEvent) // objEvent is just the payload...
                    .then(response => {
                        // console.log(response) // yep
                        if(response.status === 200){
                            context.commit('saveMyEventMutation', objEvent)

/*
                            /!* ARTIFICIALLY SLOW DOWN THE SERVER RESPONSE *!/
                            setTimeout(function() {
                                resolve()
                            }, 2500)
*/

                            resolve()
                        } else { // TODO Error handling ...
                            reject()
                        }
                    })
            }) // /PROMISE
        }, // /addEventAction   (returns a Promise)  see EventForm.vue

        doSyncAction(context) { // << No payload
            // Dispatched from: CurrentMonth.vue
            // - This Action (HERE IN /STORE/INDEX.JS) should:
            //     A) Brute Force / Much Easier / Good Enough
            // - 1) send GET to '/events'
            // - 2) receive back all the OnServer Events
            // - 3) pretty much replace the Vuex Store State for Events, oui?
            return new Promise((resolve, reject) => {
                Axios.get('/events')
                    .then((response) => {

                        console.log('doSyncAction response.status: ', response.status) // 200
                        console.log('doSyncAction response: ', response) // response.data: [] Array of {}. wr__date is just a String, pretty sure.

                        if(response.status === 200) {
                            console.log('doSyncAction response.data: ', response.data)

                            // We have wr__dates that are just Strings. Need to "Momentize()" (like we do in WEB.ENTRY.JS)
                            let allEventsFromServerAsMomentObjects = []
                            allEventsFromServerAsMomentObjects = response.data.map(function(eachEvent) {
                                return {
                                    description: eachEvent.description,
                                    wr__date: moment(eachEvent.wr__date)
                                }
                            })

                            // https://alligator.io/vuejs/rest-api-axios/
                            context.commit('doSyncMutation', allEventsFromServerAsMomentObjects) // >> Nope >> response.data)
                            resolve()
                        } else {
                            reject()
                        }
                    })
            }) // /Promise
        }

    } // /actions: {}
    // } // << DUMKOPPF! No need for "store: {}" wrapper around!!! (o la)
})