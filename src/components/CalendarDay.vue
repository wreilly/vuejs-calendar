<template>
    <div v-bind:class="objectForCSSClasses">
    <!--<div class="day">-->
        <!--Here in CalendarDay component: -->
        {{ dayForCDay.format('D') }}
    </div>
</template>

<script>

    export default {
        props: ['dayForCDay'],
        computed: {
            objectForCSSClasses() {
                return {
                    // ALL the divs that hold a "day" should get the CSS class 'day'
                    day: true,

                    // ONLY the one div that holds the "day" for *today* gets the CSS class 'today' (light yellow)
                    // Compare the passed-in prop for "day" (dayForCDay) to a $moment constructor's 'day' part. Cheers.
                    today: this.dayForCDay.isSame(this.$moment(), 'day')
                }
            }
        }
    }
</script>