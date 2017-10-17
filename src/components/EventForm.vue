<template>
    <div id="event-form"
         v-bind:class="{ active: activeComputed }"
         v-bind:style="{ top: topComputed, left: leftComputed }">
        <!--
        https://www.w3schools.com/css/css_positioning.asp

         v-bind:class="{ active: true }"
         v-bind:class="{ active: this.$store.state.eventFormActiveBool }"

        v-bind:style="{ top: '500px', left: '500px' }">-->

        <h4>Add an event</h4>
        <button id="close-button" v-on:click="close">&#10005</button>

    </div>

<!-- Notes:

A "style" hard-coded wants CSS, so, inside double quotes: no single quotes around values, no curly braces.
A "v-bind:style" wants JavaScript object, so:
 -- if you're "binding" a faked hard-coded one, you do:
   ---  inside double quotes: curly braces yes and single quotes around values yes.
 -- if you're "binding" to a computed property, you do:
   ---  inside double quotes: curly braces yes and *no* quotes around computed property names.

           style="  top:  500px;      left:  500px;  "
    v-bind:style="{ top: '500px',     left: '500px' }"
    v-bind:style="{ top: topComputed, left: leftComputed }">
-->
</template>

<script>

    export default {
        computed: {
            activeComputed() {
              return this.$store.state.eventFormActiveBool
            },
            topComputed() {
//                return '100px'
                console.log('eventFormPosY: ', this.$store.state.eventFormPosY)
                return `${this.$store.state.eventFormPosY}px`
            },
            leftComputed() {
//                return '200px'
                console.log('eventFormPosX: ', this.$store.state.eventFormPosX)
                return `${this.$store.state.eventFormPosX}px`
            }
        },
        methods: {
            close() {
                this.$store.commit('eventFormActive', false)
            }
        }
    }
</script>