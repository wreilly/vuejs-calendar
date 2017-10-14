<template>
    <div>{{ msg }}</div>
</template>

<script>
    export default {
        data() {
            return {
                msg: 'Hello World from App.vue'
            }
        },
        created() {
            console.log('defined Property on VueJS bus for "this.$moment" is: ', this.$moment)
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