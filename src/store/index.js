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

// Seems odd. I thought 'this' was omni/always-present, and all that jazz. Huh.
// Might have been difficile to know just *what* 'this' is/was, but I didn't expect it to just Not Be There. Hmmph.
// console.log('this in Store is ? ', this) // undefined. Hmm!
// Solution: Don't use it! Drop it off those lines below referencing $moment off of 'this.' So simple. Who knew.

export default new Vuex.Store({
    // store: { // << DUMKOPPF! No need for "store: {}" wrapper around!!! (o la)
        state: {
            currentYear: 2017,
            currentMonth: 10,
            eventFormPosY: 450,
            eventFormPosX: 50,
            eventFormActiveBool: false,
            eventCalendarDay: {}, // Worked: >> '', // Worked: >> null, // Worked: >> {}, // will be Moment object
            mockDataEventsFromStore:  [ // was in CalendarDay.vue, mocked up
                // { description: 'yeah 0', wr__date: this.$moment().subtract(1, 'month') },
                { description: 'yeah 0', wr__date: moment().subtract(1, 'month') }, // get rid of "this.$"
                // Error encountered:
                // "TypeError: Cannot read property '$moment' of undefined"
                { description: 'yeah 1', wr__date: moment() },
                { description: 'yeah 2', wr__date: moment().add(1, 'day') },
                { description: 'yeah 2.A', wr__date: moment().add(1, 'day') },
                { description: 'yeah 3', wr__date: moment().add(10, 'day') }
            ]
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
            captureEventCalendarDay(state, payload) {
                state.eventCalendarDay = payload // dayForCDay
            },
            saveMyEventAction(state, payload) {
                state.mockDataEventsFromStore.push( payload
/* Not this. The payload is already an object thing.
                    {
                    description: payload,
                    wr__date: eventCalendarDay
                }

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

 addEvent(state, payload) {  // << My WR__ 'saveMyEventAction()'
   state.events.push({
     description: payload,
     date: state.eventFormDate
   })
  },
 eventFormDate(state, payload) {  // << My WR__ 'captureEventCalendarDay()'
     state.eventFormDate = payload
   }


*/
                )
            }
        }
    // } // << DUMKOPPF! No need for "store: {}" wrapper around!!! (o la)
})