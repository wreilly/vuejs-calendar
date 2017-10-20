<template>
    <div v-bind:class="objectForCSSClasses"
         v-on:click="captureClick">
    <!--<div class="day">-->
        {{ dayForCDay.format('D') }}
        <ul class="event-list">
            <li v-for="event in events">{{ event.description }} | {{ event.wr__date.format('YYYY-MM-DD') }}</li>
        </ul>
    </div>
</template>

<script>
    /*
    Q. What Is This Component?
    A. Represents one DAY in Calendar view.

       So - we're gonna have some 42 of them per "Monthly" calendar view, right?
       6 rows of 7 days apiece - to include (of course) the "padding" days of
       the final days of previous month, and the initial days of following month.
       (N.B. Some months it only needs 5 rows ergo 35, not 42. fwiw.)

       This Component gets fed its data (via props) one Moment.js object, for one day.

       That 'day' data is generated in App.vue and passed down.
       Here in CalendarDay.vue I gave it the funny name 'dayForCDay'.

       Also: we have "mockDataEvents" [] - each day can get multiple (or 1 or 0) events
     */
    export default {
        props: ['dayForCDay'],
        computed: {
            objectForCSSClasses() {
                // Stick this object into a div's *class* attribute...
                // It carries Boolean T/F to say Yay/Nay to causing certain CSS classes to be applied.

                // REMEMBER! (O la.) In Moment.js, MONTHS ARE ZERO-BASED. "+ 1" is your friend.
//                console.log('objectForCSSClasses ... (this.dayForCDay.month() + 1) ', (this.dayForCDay.month() + 1))

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
            },
            events() {
/*  Now to VUEX STORE:
                let mockDataEvents = [
                    { description: 'yeah 0', wr__date: this.$moment().subtract(1, 'month') },
                    { description: 'yeah 1', wr__date: this.$moment() },
                    { description: 'yeah 2', wr__date: this.$moment().add(1, 'day') },
                    { description: 'yeah 2.A', wr__date: this.$moment().add(1, 'day') },
                    { description: 'yeah 3', wr__date: this.$moment().add(10, 'day') }
                ]
*/

                let mockDataEvents = this.$store.state.mockDataEventsFromStore // whamma ?

//                return mockDataEvents
//                console.log('mockDataEvents[0].wr__date.format(\'YYYY-MM-DD\') ', mockDataEvents[0].wr__date.format('YYYY-MM-DD')) // Yes Oct 17 (today)
//                console.log('this.dayForCDay.format(\'YYYY-MM-DD\') ', this.dayForCDay.format('YYYY-MM-DD')) // okay, shows each day ...

// TYPO!! I put closing ')' on the .isSame() too soon, lopped off 2nd argument: ", day"
                // Strange. What the H___ can you pass in as "thisArg" to filter() ??
                // Below I try all kinds of nuttiness: // this) // mockDataEvents) // NaN ) // 99) // 'day') // << ALL ARE WRONG!
                // NONE throw any kind of error. ALL are W-R-O-N-G. Sigh.
// NO NO NO NO NO   return mockDataEvents.filter(event => event.wr__date.isSame(this.dayForCDay), this) // mockDataEvents) // NaN )//99) //'day') // << WRONG!
// WRONG                let whatIGot = mockDataEvents.filter(event => event.wr__date.isSame(this.dayForCDay), 'day') // << WRONG!
// RIGHT:
               let whatIGot = mockDataEvents.filter(event => event.wr__date.isSame(this.dayForCDay, 'day')) // << RIGHT.

                let myDumbCounter = 0
                // Not used; just testing... In Lieu of ONE-LINER .filter()
                let whatIGotLongMode = mockDataEvents.filter( (eventThisTime) => {
//                    console.log('eventThisTime.wr__date.format(\'YYYY-MM-DD\') ', eventThisTime.wr__date.format('YYYY-MM-DD'))
  //                  console.log('this.dayForCDay.format(\'YYYY-MM-DD\') ', this.dayForCDay.format('YYYY-MM-DD')) // Hmm. Last we see this is Nov 5 (last day on this calendar. hmm.)
                    /* Very Strange
                    Q. Why/How does LINE 1 (below) even run, not get JavaScript error?
                    Q. That is, what is that extra ", 'day')" doing there ?? ??

                    A. O la. (partial answer)
                     Well, at least for my console.log() outputting below, I find that:
                    the G.D. extra:  ", 'day')"  has become, VERY UNWITTINGLY, just Another Stupid Useless Parameter to CONSOLE.LOG()
                    // wtf. oy. brain-dead. hard-to-spot. pain-in-the-u-know-what. Sheesh.

                    A. (part I don't yet get)
                    But... what about my array.filter() above? what is the extra: ", 'day')" doing there ??
                    Hmm. Go To The Docs:
                     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                     Seems that second argument is optional "thisArg"
                     Hmm.
                     And if you pass in a String (as I do), that flies? odd.  'day'
                     Maybe it just gets dropped on the floor



                    Result for LINE 2 is correct: mock event on right dates (today, tomorrow)
                    Result for LINE 1 is weird: both mock events on EVERY day in calendar (w-a-a-h?)
                    Result for LINE 1.A. : NO days on calendar get anything. hmm.
                    */


/* ***** FAILED Little Experiment
Just trying to see/log *inside* this filter() processing, of the variable (whatIGotLongMode) that the whole filter processing gets subsequently assigned to.
But, you Cain't Do That! = All right.

                    // Hmm:  "ReferenceError: can't access lexical declaration `whatIGotLongMode' before initialization"
 //                    console.log('inside whatIGotLongMode ', whatIGotLongMode)
                    myDumbCounter++
                    if (myDumbCounter > 1) { // second time through ?? (this ain't gonna work) << Yer right. It don't. Hokay.
                        console.log(myDumbCounter)
                        console.log('inside whatIGotLongMode ', whatIGotLongMode)
                    }
*/


//                    return eventThisTime.wr__date.isSame(this.dayForCDay), 'day' // << LINE 1. weird
//                    return eventThisTime.wr__date.isSame(this.dayForCDay) // << LINE 1.A. weird
                    return eventThisTime.wr__date.isSame(this.dayForCDay, 'day') // << LINE 2. correct per Moment.js API

                    // Let's have a closer look at What The Hell is going on:
                    // TRUE for the 18th! (grazie al cielo) (false all others. bon.)
//                    console.log('eventThisTime.wr__date.isSame(this.dayForCDay, \'day\') ', eventThisTime.wr__date.isSame(this.dayForCDay, 'day') )
                    // FALSE for ALL. (That's a GOOD thing.)
  //                  console.log('eventThisTime.wr__date.isSame(this.dayForCDay), \'day\' ', eventThisTime.wr__date.isSame(this.dayForCDay), 'day' )

                })


                // All right. Now here at the bottom let's just look at these two array variable thingies, all told: Yes, working right - empty array for CalendarDay w. NO Events; array w. 1 or 2 when there's 1 or 2 events, for that day. Cheers
  //              console.log('after filter: whatIGot ', whatIGot)
  //              console.log('after filter: whatIGotLongMode ', whatIGotLongMode)


// 01 - Don't work when there's nothing in your array!
//       (Immediate IF / Ternary can't give me a 'nothing' sort of response. null didn't work either. O well.)
//                console.log('whatIGot[0].wr__date: ', whatIGot.length > 0 ? '**************************** >>>> ' + whatIGot[0].wr__date.format('YYYY-MM-DD') : '') // Hmm. []

                /* FINDING ("ta-da")
                Okay -the DevTools Console, both Firefox and Chrome, do nice job of "collapsing" or "rolling up" any REPEATED log lines. They put a number counter in margin, to show how many in a row were SAME THING.
                When, below, I do EITHER whatIGot, OR whatIGotLongMode, this rolling up works fine. Bon.
                But when I (below) log BOTH of these statements (overkill I know), then that DEFEATS the roll-up thing, and I instead wind up with lots and lots of logged lines. Since I'm logging two statements, you do NOT get a single statement that repeats. okay.
                (Note: This fact that you are logging two statements is even true (seems bit odd) when both the "statements" are the same thing, like : 'teststring' or '' (empty string, from that ternary expression.)

Kind of fix: 1) don't log things twice.
           Or, 2) don't use ternary; use full if () {} to get control of what you log out
                */

// 02 - Works okay, but you get an empty line in log for all CalendarDays with NO Event.
//       (Immediate IF / Ternary can't give me a 'nothing' sort of response. null didn't work either. O well.)
//                console.log(whatIGot.length > 0 ? '**************************** >>>> whatIGot[0].wr__date: ' + whatIGot[0].wr__date.format('YYYY-MM-DD') : '') // 'teststring') // Hmm. []

// 03 - Mo' better: Only log a line for CalendarDays that DO have an Event. :o)
                if (whatIGot.length > 0 ) {
                    console.log('**************************** >>>> whatIGot[0].wr__date: ' + whatIGot[0].wr__date.format('YYYY-MM-DD'))
                }

// 01 - Don't work when there's nothing in your array!
//                console.log('whatIGotLongMode[0].wr__date: ', whatIGotLongMode[0].wr__date) // Hmm. []
// 02 - (as above)
//                console.log(whatIGotLongMode.length > 0 ? '**************************** >>>> whatIGotLongMode[0].wr__date: ' + whatIGotLongMode[0].wr__date.format('YYYY-MM-DD') : '') // 'teststring') // Hmm. []
// 03 - Mo' better, too:
                if (whatIGotLongMode.length > 0) {
                    console.log('**************************** >>>> whatIGotLongMode[0].wr__date: ' + whatIGotLongMode[0].wr__date.format('YYYY-MM-DD'))
                }
                return whatIGot
//                return whatIGotLongMode
            }
        },
        methods: {
            captureClick(event) {
                console.log(event)
                this.$store.commit('eventFormActive', true)
                this.$store.commit('captureEventCalendarDay', this.dayForCDay)
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