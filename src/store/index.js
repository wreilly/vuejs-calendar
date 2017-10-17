import Vue from 'vue'

// LESSON 138 - 142 - Now in its own file: VUEX!
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    // store: { // << DUMKOPPF! No need for "store: {}" wrapper around!!! (o la)
        state: {
            currentYear: 2017,
            currentMonth: 10
        },
        mutations: {
            setCurrentYear(state, payload) {
                state.currentYear = payload // whamma-jamma
            },
            setCurrentMonth(state, payload) {
                state.currentMonth = payload // whamma-jamma
            }
        }
    // } // << DUMKOPPF! No need for "store: {}" wrapper around!!! (o la)
})