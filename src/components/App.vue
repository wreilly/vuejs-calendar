<template>
    <div>
        <div id="header">
            <div>
                <h3>Vue.js Calendar</h3>
            </div>
            <div>
                <current-month></current-month>
            </div>
        </div>
        <div id="day-bar">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
        </div>
        <div id="calendar">
            <!--<p>{{ msg }}</p>-->
            <!--<p>Weeks!</p>-->
            <div v-for="week in weeks" class="calendar-week">
                <!--Week! Set of 7 "calendar-day" components, my friend.-->
                <calendar-day v-for="day in week" v-bind:dayForCDay="day"></calendar-day>
            </div>
            <!--
                    <p>Days!</p>
                    <div v-for="day in days">{{ day }}</div>
            -->
        </div>
        <event-form>
            <!-- (Same note posted to EventForm.vue)

N.B. This EventForm.vue Component is sort of "ghostly" ...

- It is "included" via the <template> for App.vue.
 -- As you can see, it has no props nor anything here.
- Its appearance (or not) in the DOM (and on the page) is dictated by the CSS class 'active' (true or false).
- Also, its position is driven by X, Y coords captured upon click in any given CalendarDay.vue component.

Cheers.
-->
        </event-form>
    </div>
</template>

<script>
    import CalendarDay from './CalendarDay.vue'
    import CurrentMonth from './CurrentMonth.vue'
    import EventForm from './EventForm.vue'

    export default {
        data() {
            return {
                msg: 'Hello World from App.vue',
                // Now with application-wide Vuex (below), replaces this component-specific data() {} here
/*
                month: 10,
                year: 2017
*/
            }
        },
        components: {
            'calendar-day': CalendarDay,
            'current-month': CurrentMonth,
            'event-form': EventForm
        },
        computed: {
/* False alarm. *Not* supposed to comment these out (month() year() etc.). Sigh. << Yeah.

  Wrong>> HAH! I HAD NOT "COMMENTED THESE THE **CK OUT"  << Wrong
Yeesh.  Were conflicting with same definitions in new CurrentMonth.vue. << Wrong
*/
            month() {
                // Now in application-wide Vuex, replaces component-specific data() {} above
              return this.$store.state.currentMonth
            },
            year() {
              return this.$store.state.currentYear
            },
            weeks() {
                // One little note:
                // This computed() property 'weeks()' depends on/uses
                // the other computed() property 'days()'.
                // And/but no it doesn't matter that you put 'weeks()' first
                // in your code. Still works. "Ta-da."

                let weeks = []
                let week = []
                for (let day of this.days) {
                    week.push(day)
                    if (week.length === 7) { // filled with one week, 7 days
                        weeks.push(week)
                        week = [] // empty it back out
                    }
                }
                return weeks
            },
            days() {

              /* ******************************************** */
              /* GENERATE ALL DAYS/DATES IN CURRENT MONTH */
              let days = []
              let firstDayOfMonth = 1 //
              let currentDay = this.$moment(`${this.year}-${this.month}-${firstDayOfMonth}`, 'YYYY-M-D')
              // "2017-10-01T00:00:00.000Z"
              // "2017-10-02T00:00:00.000Z" ... -> 31

//              console.log('currentDay from git-go: ', currentDay)
              /* Yep.
               currentDay from git-go:  Object { _isAMomentObject: true, _i: "2017-10-14", _f: "YYYY-MM-DD", _isUTC: true, _pf: {…}, _locale: {…}, _a: […], _d: Date 2017-10-14T00:00:00.000Z, _isValid: true, _z: {…}, … } 126:22:13
               */
              /* Hmm. bit of oddness...
              Saw different (off by one) date in Firefox vs. Chrome consoles. (!)
               https://stackoverflow.com/questions/28126529/momentjs-internal-object-what-is-d-vs-i
               "The moment internals have some quirks due to how the Date object works..."
              */
//                console.log('this.$moment(currentDay)._d from git-go: ', this.$moment(currentDay)._d)
                console.log('this.$moment(currentDay).format(\'YYYY-MM-DD\') from git-go: ', this.$moment(currentDay).format('YYYY-MM-DD'))
              /* Yep.
               this.$moment(currentDay) from git-go:  Object { _isAMomentObject: true, _i: "2017-10-14", _f: "YYYY-MM-DD", _isUTC: true, _offset: -0, _pf: {…}, _locale: {…}, _z: {…}, _a: […], _d: Date 2017-10-14T00:00:00.000Z, … } 126:23:13
               */

              do {
                  days.push(currentDay)
                  // http://momentjs.com/docs/#/manipulating/add/
                  // make "currentDay" (dumb name) increment by one ...
                  // No - you can't just mutate/whatever the 'currentDay' var/obj/thing itself, mate.
/*
                  currentDay = currentDay.add(1, 'days') // << NO!
                  console.log('currentDay after the WRONG Big Add : ', currentDay)
                  console.log('and days, how are we? ', days)
*/

                  // Yes - make a *new* Moment object/instance/thing,
                  // feeding it whatever 'currentDay' has by now become
                  // (increment after increment after increment),
                  // and whamma-jamma *that* onto the existing 'currentDay' var/thing.
                  currentDay = this.$moment(currentDay).add(1, 'days') // << YES.
//                  console.log('currentDay after the CORRECT Big Add : ', currentDay)
                  /*
                   _a: Array [ 2017, 9, 14, … ]
                   _d: Date 2017-10-30T00:00:00.000Z  <<<<<<<<< October 30th
                   _f: "YYYY-MM-DD"
                   _i: "2017-10-14"
                   _isAMomentObject: true ...
                  */
  //                console.log('and days, how are we? ', days) // Yep. Array ...

                  // Ah! The next line has to do simply with my Vue data{} property. Nothing to do with Moment.js. (whew)
    //              console.log('and, what the HELL is "this", that we do "this.month" pray tell? ', this) // Vue Component _uid: 1
                // still processing days within current month? (as indicated in data{} month above)
                  // Oo la. "Zero-based month" "from 0 to 11" Add one, boys!
              } while ((currentDay.month() + 1 ) === this.month);

              // Let us grab these two values right here right now while easy, convenient
              // (Why? Because further along our days array gets more complicated by "Previous" and "Following" months days...)
              let currentDayFirstCurrentMonth = this.$moment(days[0]) // FIRST DAY OF CURRENT MONTH (E.g. October 1st)
              // IMPORTANT!  That wretched "- 1". Oy!
              let currentDayLastCurrentMonth = this.$moment(days[days.length - 1]) // LAST DAY OF CURRENT MONTH (E.g. October 31st)
              console.log('wtff currentDayLastCurrentMonth: ', currentDayLastCurrentMonth)
//              console.log('wtff days.length: ', days.length)
//              console.log('wtff days[days.length - 1]: ', days[days.length - 1])
//              console.log('wtff currentDayLastCurrentMonth.day(): ', currentDayLastCurrentMonth.day()) // Yes. 2. October 31, 2017 is a Tuesday. A 2. Bon.

//              return days // stopgap script stopper thing




              /* ******************************************** */
              /* GENERATE NEEDED DAYS/DATES IN PREVIOUS MONTH */
              // Back up days, till you get a MONDAY (!) :) (Our "First day of the week")
              // Mind, your Current Month *may* have started on a Monday! (like May 2017)

              // Grab "0th" day from current month (e.g. "October 1st")
              // We use that Moment object as param to pass to "this.$moment()"

              currentDay = this.$moment(days[0])
              // AARRGGH.
              // *MY* Calendar Week starts on a frickin' SUNDAY.
              // *HIS* G.D. Calendar Week starts on frickin' *MONDAY* ("piece of junk American door...")
              // console.log('currentDay for days[0] ... For MY October 1st, 2017 should be Sunday, a "0"  ', currentDay) // Yes. 0.
//              console.log('currentDay for days[0] ... For HIS October 1st, 2017 should still be Sunday, a "0"  ', currentDay) // Yes. 0.

              // If it is '1', then the current month *starts* on a Monday!
              // No need for "previous month" dates. Cheers
              // E.g., MAY 2017 starts on a MONDAY
              let dayOfWeekFirstDayOfCurrentMonth = currentDay.days()
              console.log('dayOfWeekFirstDayOfCurrentMonth: ',  dayOfWeekFirstDayOfCurrentMonth)

              const SUNDAY = 0
              const MONDAY = 1

//              if ( dayOfWeekFirstDayOfCurrentMonth !== 1 ) { // Current Month did not start on a Monday... 
              if ( dayOfWeekFirstDayOfCurrentMonth !== MONDAY ) { // Current Month did not start on a Monday... 
                  do {
                      currentDay = this.$moment(currentDay).subtract(1, 'days')
//                      days.push(currentDay)
                      days.unshift(currentDay) // << Better. puts at FRONT of array. :)
                      console.log('PREVIOUS MONTH - currentDay._d: ', currentDay._d) // Obj
//                      console.log('currentDay.day() : ', currentDay.day()) // e.g. 6 (0-based array of weekdays
                      // Sunday is 0, Monday is 1 ... Saturday is 6.
                      // ._locale._weekdays gets you "Sunday" etc.
//                      console.log('currentDay._locale._weekdays[currentDay.day()] : ', currentDay._locale._weekdays[currentDay.day()]) // e.g. Saturday
                  } while (
                      // Hah! Classic. I need this test in an IF, not in DO-WHILE.
                      // Why? Because DO-WHILE will ALWAYS "DO" whatever it is, at least one time!! (Hah on you, WR__). Oy.
//  No            dayOfWeekFirstDayOfCurrentMonth !== 1 // Current Month did not start on a Monday...
//  No            &&

//                  currentDay.day() !== 1) // 1 is Monday. Our Calendar mode has Monday as "first day of the week".
                  currentDay.day() !== MONDAY) // 1 is Monday. Our Calendar mode has Monday as "first day of the week".

                  /* LOOP THINKING:
                   While this statement returns say a 3, or a 2, go ahead, "do" the loop:
                   - On Wed. (a 3), do the loop (does subtraction, pushes a Tuesday onto the Array. good)
                   - On Tues. (a 2), do the loop (does subtraction, pushes a Monday onto the Array. good)
                   - When it is a Mon. (a 1), do *NOT* do the loop! - We don't want subtraction, we don't want a Sunday pushed onto the Array. We are DONE.
                   */
              }





              /* ******************************************** */
              /* GENERATE NEEDED DAYS/DATES IN FOLLOWING MONTH */
              // Advance days, till you get a SUNDAY (!) :) (Our "Last day of the week")
              // Mind, your Current Month *may* have ended on a Sunday! (like April 2017)

// No:          let currentDay = this.days[days.length()] // LAST day in your current month // << Not using.
               // currentDayLastCurrentMonth // << Instead we'll use this. I grabbed this above. It is e.g. October 31st.

           //   let i = 0

              // So long as current month does not END on a Sunday ... we'll do the loop
//              console.log('BEFORE IF - currentDayLastCurrentMonth.day(): ', currentDayLastCurrentMonth.day())
//              if (currentDayLastCurrentMonth.day() !== 0) { // 0 magic number for Sunday
              if (currentDayLastCurrentMonth.day() !== SUNDAY) { // 0 magic number for Sunday
//                  console.log('INSIDE IF - currentDayLastCurrentMonth.day(): ', currentDayLastCurrentMonth.day())
                  currentDay = this.$moment(currentDayLastCurrentMonth) // Do *not* just whamma-jamma
                  do {
/* D'OH! *INFINITE LOOP* (Yeesh.)
Do NOT declare a variable INSIDE your loop, son:
                      let currentDay = currentDayLastCurrentMonth.add(1, 'days')
*/
/* Wrong.
                      currentDay = currentDayLastCurrentMonth.add(1, 'days') // << No. Not it.
*/
/* Wrong! This way you got ALL the extra days in the following month as SAME 11-05-2017.
Need to new create a NEW Moment.js object for each day!
                      currentDay = currentDay.add(1, 'days') // << No, still not it.
*/
                      currentDay = this.$moment(currentDay).add(1, 'days') // << Mo' better.
                      days.push(currentDay)
                      console.log('FOLLOWING MONTH - currentDay._d: ', currentDay._d)
                    //  i++
                  } while (
                      //i < 15
                  // &&
//                  currentDay.day() !== 0 ) // loop till we bump into Sunday (0)
                  currentDay.day() !== SUNDAY ) // loop till we bump into Sunday (0)
              }

              return days
            },
        },
        created() {
// Yep:            console.log('defined Property on VueJS bus for "this.$moment" is: ', this.$moment)
            /*
            Interesting.

            Chrome DevTools Console - simply:
             ------------
             defined Property on VueJS bus for "this.$moment" is:  ƒ hooks() {
             return hookCallback.apply(null, arguments);
             }
             ------------

            FirefoxDeveloperEdition DevTools Console - entire Moment.JS function/API/whatever-it-is:
             ------------
             defined Property on VueJS bus for "this.$moment" is:
             hooks()
             ISO_8601: function hooks.ISO_8601()
             RFC_2822: function hooks.RFC_2822()
             calendarFormat: function getCalendarFormat()
             createFromInputFallback: function deprecate/<()
             defaultFormat: "YYYY-MM-DDTHH:mm:ssZ"
             defaultFormatUtc: "YYYY-MM-DDTHH:mm:ss[Z]"
             defaultZone: Object { name: "UTC", abbrs: […], population: 0, … }
             defineLocale: function defineLocale()
             deprecationHandler: null
             duration: function createDuration()
             fn: Object { add: createAdder/<(), calendar: calendar$1(), clone: clone(), … }
             ...
             ------------
             */
        }
    }
</script>