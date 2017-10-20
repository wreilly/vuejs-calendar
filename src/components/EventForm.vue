<template>
    <!--  (Same comment posted to App.vue)

    N.B. This EventForm.vue Component is sort of "ghostly" ...

    - It is "included" via the <template> for App.vue.
      -- It has no props nor anything there.
    - Its appearance (or not) in the DOM (and on the page) is dictated by the CSS class 'active' (true or false).
    - Also, its position is driven by X, Y coords captured upon click in any given CalendarDay.vue component.

    Cheers.
    -->
    <div id="event-form"
         v-bind:class="{ active: activeComputed }"
         v-bind:style="{ top: topComputed, left: leftComputed }">
        <!--
        https://www.w3schools.com/css/css_positioning.asp

         v-bind:class="{ active: true }"
         v-bind:class="{ active: this.$store.state.eventFormActiveBool }"

        v-bind:style="{ top: '500px', left: '500px' }">-->

        <h4>Add an event</h4>
        <div class="text">
            <!--<div>{{ dayForCDayEventFormComputed }}</div>-->
            <!--<div>{{ dayForCDayEventFormComputed.format('YYYY MM DD') }}</div>-->
            <div>{{ dayForCDayEventFormComputed.format('dddd, MMM Do') }}</div>

            <!-- Ye Olde Syntactic Sugar:
            https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events

<input v-model="something">
is syntactic sugar for:
<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">

  AND
  When used with a component, it instead simplifies to:
<custom-input
  :value="something"
  @input="value => { something = value }">
</custom-input>

Huh.

YES:            <input type="text" v-bind:value="description" v-on:input="description = $event.target.value" />

NO:            <input type="text" v-bind:value="description" v-on:input="value => { description = value }" />
(Of course, the above is *not* on a "custom component" so I'm doing it wrong. Just trying things out.
In Vue DevTools we see <EventForm> description is correct at first, but upon any input, what is in that input box is : [object InputEvent]. ok.)


See also: (I was just trying to recall where else I'd seen v-bind: in use)
https://vuejs.org/v2/guide/components.html#Passing-Data-with-Props
"Similar to binding a normal attribute to an expression, we can also use v-bind for dynamically binding props to data on the parent. ..."
            -->

            <input type="text"
                   v-bind:value="description"
                   v-on:input="description = $event.target.value"
                   placeholder="Wild asparagus picking"
                   v-my-focus
                   v-on:keyup.enter="saveMyEvent"/>
        </div>
        <div class="buttons">
            <button type="submit" v-on:click="saveMyEvent">Save</button>
        </div>
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
        data() {
            return {
                description: '' // 'default description'
            }
        },
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
            },
            dayForCDayEventFormComputed() {
                return this.$store.state.eventCalendarDay
            }
        },
        methods: {
            close() {
                this.$store.commit('eventFormActive', false)
                this.description = '' // re-clear it
            },
            saveMyEvent() {
                if (this.description === '') {
//                    gotta write something
                } else { // Good to go
                    this.$store.commit('saveMyEventAction', {
                        description: this.description,
                        wr__date: this.dayForCDayEventFormComputed
                    })
                    this.close()
                }
            }
        },
        directives: {
            'my-focus': {
                update(el) {
                    console.log('v-MyFocus ? el.value ', el.value)
//                    console.debug('v-MyFocus ? el.value ', el.value)
                    el.focus()
                }
            }
        }
    }
</script>