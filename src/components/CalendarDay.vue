<template>
    <div v-bind:class="objectForCSSClasses"
         v-on:click="captureClick">
    <!--<div class="day">-->
        {{ dayForCDay.format('D') }}
    </div>
</template>

<script>
    /*
    Q. What Is This Component?
    A. Represents one DAY in Calendar view.

       So - we're gonna have some 42 of them per "Monthly" calendar view, right?
       6 rows of 7 days apiece - to include (of course) the "padding" days of
       the final days of previous month, and the initial days of following month.

       This Component gets fed its data (via props) one Moment.js object, for one day.

       That 'day' data is generated in App.vue and passed down.
       Here in CalendarDay.vue I gave it the funny name 'dayForCDay'.
     */
    export default {
        props: ['dayForCDay'],
        computed: {
            objectForCSSClasses() {
                // Stick this object into a div's *class* attribute...
                // It carries Boolean T/F to say Yay/Nay to causing certain CSS classes to be applied.

                // REMEMBER! (O la.) In Moment.js, MONTHS ARE ZERO-BASED. "+ 1" is your friend.
                console.log('objectForCSSClasses ... (this.dayForCDay.month() + 1) ', (this.dayForCDay.month() + 1))

                // Bit o' D.R.Y.-er code. We figure out "today" once, not multi times.
                // 'today' is just Boolean: Yup or Nope
                let today = this.dayForCDay.isSame(this.$moment(), 'day')

                return {
                    // ALL the divs that hold a "day" should get the CSS class 'day'
                    day: true,

                    // ONLY the one div that holds the "day" for *today* gets the CSS class 'today' (light yellow)
                    // Compare the passed-in prop for "day" (dayForCDay) to a $moment constructor's 'day' part. Cheers.
                    //             background-color: $buttermilk;
/* Works fine. Just not v. D.R.Y.
                    today: this.dayForCDay.isSame(this.$moment(), 'day'),
*/
                    // On left: class name. On right: Boolean var (See above)
                    today: today,

                    // PAST days ... (cain't get there no mo') = opacity: 0.6;
                    // TAKE ONE: Seems to work okay... however...
/* HMM. "Do not use '.isBefore()'" HMM.
                    past: this.dayForCDay.isBefore(this.$moment(), 'day'),
*/
                    /* ? HUH ?
                     http://momentjs.com/docs/#/query/is-before/
                    "NOTE: moment().isBefore() has undefined behavior and should not be used! If the code runs fast the initial created moment would be the same as the one created in isBefore to perform the check, so the result would be false. But if the code runs slower it's possible that the moment created in isBefore is measurably after the one created in moment(), so the call would return true."
                     */

                    // TAKE TWO: YES/WORKS: (1) sameorbefore AND NOT (2) today however.
/* We can do D.R.Y.-er than this my friend...
                    past: (
                        this.dayForCDay.isSameOrBefore(this.$moment(), 'day')
                        &&
                        !this.dayForCDay.isSame(this.$moment(), 'day')
                    ),
*/

                    // TAKE THREE (Instructor D.R.Y. Approach (!))
                    past: this.dayForCDay.isSameOrBefore(this.$moment(), 'day') && !today,

                    // color: $alto;
                    // For INITIAL "CURRENT" MONTH (the month it actually is, now. e.g. October)
                    //  you can simply use "this.$moment().month()"
//                    'not-current-month': this.dayForCDay.month() !== this.$moment().month()

                    // But for a "Current"/Display/Show-Me month of increment/decrement, (e.g. September, November...)
                    //  you need to get "currentMonth" from Vuex Store. Works for good old October too.
                    // REMEMBER! (O la.) In Moment.js, MONTHS ARE ZERO-BASED. "+ 1" is your friend.
                    'not-current-month': (this.dayForCDay.month() + 1) !== this.$store.state.currentMonth // this.$moment().month()
                }
            }
        },
        methods: {
            captureClick(event) {
                console.log(event)
                this.$store.commit('eventFormActive', true)
                console.log('event.clientY: ', event.clientY)
                console.log('event.clientX: ', event.clientX)
                this.$store.commit('assignClickPosY', event.clientY)
                this.$store.commit('assignClickPosX', event.clientX)
                /*
                click
                  clientX: 290 <<<<<
                  clientY: 528 <<<<<
                  layerX: 47
                  layerY: 39
                  movementX: 290
                  movementY: 528
                  offsetX: 0
                  offsetY: 0
                  pageX: 290
                  pageY: 528
                  screenX: 230
                  screenY: 532
                  x: 290
                  y: 528
                 */
            }
        }
    }
</script>