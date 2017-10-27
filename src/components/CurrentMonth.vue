<template>
    <div>
        <div>{{ currentMonthYearFormattedHere }}</div>
        <button v-on:click="dec">-</button>
        <button v-on:click="inc">+</button>
        <button v-on:click="sync">!</button> <!-- "!" means, sync! / refresh! / getmedata! -->
        <!--  Awright.
        Bit nutty below, but got it to work.
        The '&&' turns out is fine.
        (I'd thought, since it wasn't working, you couldn't have a '&&' expression here or some such.
        But you can. Cheers.)
        And so, before I got the '&&' working, I instead did some
        unnecessary v-if nested v-else non D.R.Y. stuff, which worked (!),
        and/so I just left it in for posterity. (Oy.)

        Also, I'd missed the '()' after .month - needed to be .month()  (D'oh!)

        Finally, yeah, my nutty extra v-if v-if v-else useless left-in stuff was
        making the page B-A-D for October 2017 .... sigh.
        An extra <div> made an extra "carriage return" (remember carriages?)
        Swapping the 2nd v-if to be a non-DOM <template> instead of a <div>
        did the trick! Veddy nice.

        O and don't forget the bit of fussy CSS for margin spacing:
        margin-left: .25rem;

        That's all.
        -->

        <!--Remember: Zero-Based Months "+ 1 is your friend"-->
        <!--<div v-if="this.$store.state.currentMonth === (this.$moment().month + 1)">-->
        <div v-if="month === (this.$moment().month() + 1) && year === this.$moment().year()">
        <!--<div v-if="month === (this.$moment().month() + 1)">            -->
            <!--<p>got same month {{ month }} and/but year is {{ year }}</p>-->
            <!-- WAS a <div> NOW a non-DOM <template>. Veddy nice. -->
            <template v-if="year === this.$moment().year()">
                <!--<p>got same year, too {{ year }}</p>-->
                <!-- YES :o) <div v-if="month === 10">-->
                <!-- NO. :o(  <div v-if="10 === (this.$moment().month + 1)"> << MISSING .() on .month! o la. -->
                <!--<div v-if="true">-->
                <div
                        style="color: #000; cursor: auto; margin-left: .25rem;">Today</div>
            </template>
            <div v-else>
                <div v-on:click="todayMonth"
                     style="color: blueviolet; cursor: pointer;">NEVER SEE THIS Today = Yup. Never do.</div>
            </div>
        </div>
        <div v-else>
            <div v-on:click="todayMonth"
                 style="color: blue; cursor: pointer; margin-left: .25rem;">Today</div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            sync() {

                this.$store.dispatch('doSyncAction') // no payload param etc. ...

                /* Pseudo-ish-code-sorta...

                SCENARIO:
                One User, two computers (two browsers anyway).
                This one user wants to see Events entered from either place appear, "synchronized"
                  Should not have to refresh page.
                  We are providing a "Sync" (!) button.
                Both computers/browsers are hitting same server (of course)

                STEPS:
                - User clicks our "!" sync button
                - This method sync() should:
                - Dispatch an Action

                - That Action (OVER IN /STORE/INDEX.JS) should:
                A) Brute Force / Much Easier / Good Enough
                - 1) send GET to '/events'
                - 2) receive back all the OnServer Events
                - 3) pretty much replace the Vuex Store State for Events, oui?
                B) Smarter / More Than I Need / Etc.
                - 1) SAME: send GET to '/events'
                - 2) SAME: receive back all the OnServer Events
                - 3) DIFFERENT: only add the ones you don't already have to the Store's State
                C) Way Smarter / Way More Than I Need / Way Etc.
                - 1) DIFFERENT: send GET to '/eventlatest'
                - 2) DIFFERENT: receive back date-time of latest Event
                - 3) DIFFERENT: IF per latest time you are missing any events...
                - 4) DIFFERENT: send GET to '/events/latest'
                - 5) DIFFERENT: receive back only those OnServer Events that are new
                - 6) DIFFERENT: add them all to the Store's State

                - So, for A.1-3,  (forget about B, C)
                - Do Mutation to replace (all) Events on State

                - DONE.

                - Vue.js reactive client app then updates everything else, auto-magically... :o)
                - Browser user who clicked Sync! will now get Events from *other* browser/users.
                - GOOD.
                */
            },
            dec() {
                console.log('dec baby!')
                if (this.month === 1) { // January. Manual fudge back into the futuresorta
                    // Sign Me Confused. Thought months were zero-based? Why 12 works here? Hmm.
                    this.$store.commit('setCurrentMonth', 12) // Hardcoded December, baby!
                    this.$store.commit('setCurrentYear', this.year - 1)
                } else {
                    this.$store.commit('setCurrentMonth', this.month - 1) // simple digit subtraction; not "Moment" stuff
                }
                // To close the Add Event modal dialog, if you shift month:
                this.close()
            },
            inc() {
                console.log('inc baby!')
                if (this.month === 12) { // December. Let's manually mangle us into the New Year...
                    // Sign Me Confused. Thought months were zero-based? Why 1 works here? Hmm.
                    this.$store.commit('setCurrentMonth', 1) // Hardcoded January, baby!
                    this.$store.commit('setCurrentYear', this.year + 1)
                } else {
                        this.$store.commit('setCurrentMonth', this.month + 1) // simple digit subtraction; not "Moment" stuff            }
                }
                // To close the Add Event modal dialog, if you shift month:
                this.close()
            },
            todayMonth() {
                console.log('this.$store.state.currentMonth ', this.$store.state.currentMonth )
                console.log('(this.$moment().month() + 1) ', (this.$moment().month() + 1))
                console.log('this.$store.state.currentMonth === (this.$moment().month() + 1)', (this.$store.state.currentMonth === this.$moment().month() + 1))
                console.log('this.month === (this.$moment().month() + 1)', (this.month === this.$moment().month() + 1))
                // Restore calendar screen to THIS month. Today. Now. Thank you.
                // We'll rely on system clock, not Vuex etc.
                // Hmm. Once again - ZERO-BASED Months. "+ 1 is your friend"
                this.$store.commit('setCurrentMonth', (this.$moment().month() + 1))
                this.$store.commit('setCurrentYear', this.$moment().year())
                // To close the Add Event modal dialog, if you shift month:
                this.close()
            },
            close() { // Modal eventForm dialog
                /* ****************************** */
                this.$store.commit('eventFormActive', false)


                /* ****************************** */
                this.$store.commit('descriptionSet', '') // Clear it in Store, yah? YAH!
                /* NOW: this does finally work. Happy October 22, 2017.
                OLD: The next line does NOT clear the description data property, over on the EventForm.vue component.
                Sorry!

                TODO ->DONE<- Hmm. If I bother to put that description into the Store, I can clear it from here.
                Is there another way? Hmm.
                Put the damned thing on a bus? ugh.
                */
                // 2) TODO ->DONE<- move description clearing to Vuex, too
                // (Same Comment over in EventForm.vue)
                // Why? Because here in CurrentMonth, if you click 'inc' or 'dec',
                // and your Add Event modal popup is open,
                // with some text in the Description field,
                // that same text will appear if you click a day in the new month you just
                // navigated to.
                // We wish to clear this description thing, over in EventForm. Need Store for that.

/* Nope.
                this.description = '' // re-clear it << Nope.
*/
            },
        },
        computed: {
            currentMonthYearFormattedHere() {
                let hardCodedToday = 16 // Cheers. Monday, October 16th, 2017. 6:01 A.M.

                console.log('currentMonthYearFormattedHere this.month ? ', this.month) // Yes. 10, then decrement to 9, etc.

//                return this.$moment('2017-10-16', 'YYYY-M-D') // "2017-10-16T00:00:00.000Z"
//                return this.$moment('2017-10-16', 'YYYY-M-D').format('MMMM YYYY') // October 2017
                return this.$moment(`${this.year}-${this.month}-${hardCodedToday}`, 'YYYY-M-D').format('MMMM YYYY')
/* Wrong-o:
                // NOPE! WRONG. >> Guess you can get away with no *DAY* value (just year, month):
//                return this.$moment(`${this.year}-${this.month}`, 'YYYY-M').format('MMMM YYYY')
*/
            },
            month() {
                /*
                AARRGGHH
                From /store/index.js
                 export default new Vuex.Store({
                 // store: { // << DUMKOPPF! No need for "store: {}" wrapper around!!! (o la)
                 state: {
                 */
//                console.log('do we get here or what? month() currentMonth ', this.$store.state.currentMonth )
//                console.log('do we get here or what? month() state ', this.$store.state )
//                console.log('do we get here or what? month() $store ', this.$store )
//                console.log('do we get here or what? month() this ', this )
                return this.$store.state.currentMonth // << integer 10 simply
            },
            year() {
                return this.$store.state.currentYear // << integer 2017 simply
            }
        }
    }
</script>