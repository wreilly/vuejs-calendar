<template>
    <div class="day"><!--Here in CalendarDay component: -->{{ dayForCDay.format('D') }}</div>
</template>

<script>

    export default {
        props: ['dayForCDay']
    }
</script>