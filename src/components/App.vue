<template>
    <div>
        <p>{{ msg }}</p>
        <div v-for="day in days">{{ day }}</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: 'Hello World from App.vue',
                month: 10,
                year: 2017
            }
        },
        computed: {
          days() {
              let days = []
              let currentDay = this.$moment(`${this.year}-${this.month}-14`, 'YYYY-MM-DD')
//              console.log('currentDay from git-go: ', currentDay)
              /* Yep.
               currentDay from git-go:  Object { _isAMomentObject: true, _i: "2017-10-14", _f: "YYYY-MM-DD", _isUTC: true, _pf: {…}, _locale: {…}, _a: […], _d: Date 2017-10-14T00:00:00.000Z, _isValid: true, _z: {…}, … } 126:22:13
               */
              console.log('this.$moment(currentDay) from git-go: ', this.$moment(currentDay))
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

              return days
            }
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