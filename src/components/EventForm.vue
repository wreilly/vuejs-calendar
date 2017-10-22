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

<!-- Good, when 'description' is simply (and more or less statically (?)) in data(): {}
                   v-bind:value="description"
                   v-on:input="description = $event.target.value"

But for COMPUTED PROPERTY 'descriptionInStoreComputed', we need this variation:
- Giving this a "re-try" :) grazie al: https://github.com/vuejs/vuex/issues/38
                   v-bind:value="descriptionInStoreComputed"
                   v-on:input="myUpdateSetterDescriptionInStoreComputed"
-->
            <input type="text"
                   v-bind:value="descriptionInStoreComputed"
                   v-on:input="myUpdateSetterDescriptionInStoreComputed"
                   placeholder="Wild asparagus picking"
                   v-my-focus
                   v-on:keyup.enter="saveMyEvent"
                   v-on:keyup.esc="close"/>
            <!-- Bit interesting:
            - ENTER KEY = good
            If I leave field empty, and hit Enter key, the ESC key will close dialog. (Good.)
            - SUBMIT BUTTON = not so good
            But if I do same and mouse click the Submit button, the ESC key is now rendered inoperable. (Not so good.)
            O well.
            -->
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
                // TODO 2) We have moved 'description' from data{} here in EventForm to the Store
                // It will be cleared by CurrentMonth, for our Use Case described there (inc/dec)
             //         description: '' // 'default description'
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
            },
            descriptionInStoreComputed() {
                return this.$store.state.description
                /*
                N.B. As the user enters each keystroke in the <input> field above,
                the "setting" of that keystroke, to the Store, is done via a Method,
                invoked on the <input> field's v-on:input event.
                That Method in turn Commits a Mutation. Cheers.
                 */
            },
            descriptionInStoreComputedWITHGETTERSETTERNotUsed: {
                // NOT USED
                // See above for plain computed() property instead


                /* https://vuejs.org/v2/guide/computed.html#Computed-Setter
                "Computed properties are by default getter-only, but you can also provide a setter when you need it..."

                */

                // OMG we're even putting the damned description field into the Store
                // Wassup w that?
                // Well, edge case where another Component (CurrentMonth.vue)
                // needs to be able to CLEAR the description field (wouldn't you know)
                get: function () {
                    return this.$store.state.description
                },
                set: function (newValue) {
                    // TODO 2) computed setter, and input event, something amiss ...
                    // NOT seeing this next line on console.log.
                    // Though the newValue IS appearing in Vue DevTools (both Vuex and Component).
                    // Also "Save" button not working (nor Enter key).
                    // Must be something (very) unhappy about trying to use
                    // input element's on-input event to set to a computed value, or something.
                    // Gonna give up on this.

                    /* Hah! "bit tricky" Hah!
                     https://vuex.vuejs.org/en/forms.html
                     "...it could be a bit tricky to use v-model on a piece of state that belongs to Vuex...."
                     ... so we'll use my old-fashioned old-favorite non-shortcut mode instead:
                     <input v-bind:value="mydata" v-on:input="mydata = $event.target.value" />
                     BUT
                     to do this for *Computed Property*,
                     we do a *variation* on that: run a *method*:
                     <input v-bind:value="mydatacomputed" v-on:input="updateMyDataComputed" />
                     and >>in that method,<< do the Vuex biz!!! ("ta-da").
                     (Once again), "broke da code." Whoa.


                     See also: for another code approach than that used here ...
                     https://github.com/vuejs/vuex/issues/38
                     "Am I cheating if I use computed properties with setters? #38"
                     */

                    /* Hmm. Further thoughts.
                    Is my scenario different than theirs?
                    They (I think) have a Form, in a Component, with an <input> field
                    that holds a Computed Property, and that they wish to bind to the Store.
                    Okay.
                    But their use case for mutating/updating that field is *In The Same Component*.
                    Hmmph.

                    My use case is from *a different Component* (CurrentMonth.vue) to update that <input> field's Computed Property ('description') -  (to clear it). Hmm.

                    Oy. Am I driven back to the need to do this via an Event Bus? Harrumph.
                    Well, before we try all that, see above "descriptionInStoreComputed()" first.
                    Note also we've effectively removed THIS bit, by dubbing it:
                    "descriptionInStoreComputedWITHGETTERSETTERNotUsed: {}"

                    */

                    console.log('descriptionInStoreComputedWITHGETTERSETTERNotUsed ??? newValue ', newValue)
                    this.$store.commit('descriptionSet', newValue)
                }

            }
        },
        methods: {
            myUpdateSetterDescriptionInStoreComputed(event) {
                console.log('myUpdateSetterDescriptionInStoreComputed ??? newValue ', event.target.value)
                this.$store.commit('descriptionSet', event.target.value)
            },
            close() {
                console.log('close() just got called, kids!')

                /* ************ */
                this.$store.commit('eventFormActive', false)


                /* ************ */
                this.$store.commit('descriptionSet', '') // << That (Vuex mutation) oughta clear it.

                /* ************ */
                this.$store.commit('highlightEventCalendarDay', false)
                // 1) TODO ->DONE<- Doesn't work from here in EventForm to "turn off" something over in CalendarDay. NEED VUEX Store, kid.
                // OVER IN CALENDARDAY, turn pink off... << Works w. Vuex.

                /* ************ HEY! DON'T DO THIS "CLEAR" PREMATURELY!
                * (I had this higher up, and that was WRONG.) Leave till LAST, my friend.
                * */
                this.description = ''
                // re-clear it. Works for here in EventForm but NOT for clearing from CurrentMonth...
                // OVER IN CURRENTMONTH, clear description. << Does *NOT* work via Vuex.
                // Q. Why not?
                // A. Something about funkiness of <input> value binding and keyup (?) biz getting matched/mixed up with Vuex - I dunno

                // 2) TODO move description clearing to Vuex, too
                // Why?
                // Because we have a Use Case with a bug:
                // If, A.) your Add Event modal popup is open,
                // with, B.) some text in the Description field,
                // and then, C.) over in CurrentMonth, if you click 'inc' or 'dec',
                // and then, D.) if you click a day in the new month you just navigated to (to "Add Event"),
                // THEN: in the new modal popup, that same old text will appear (BAD)
                // We wish to clear this description thing, here in EventForm. Need Store for that.
            },
            saveMyEvent() {
                if (this.descriptionInStoreComputed === '') {
//                    honestly, you gotta write something
                    console.log('saveMyEvent empty description = no go ...')
                } else { // Good to go
                console.log('hey, guys, what is (where is?) this.descriptionInStoreComputed, huh? ', this.descriptionInStoreComputed)
                    this.$store.commit('saveMyEventAction', {
                        description: this.descriptionInStoreComputed,
                        wr__date: this.dayForCDayEventFormComputed
                    })
                    this.close()
                }
            }
        },
        directives: {
            'my-focus': {
                update(el) { // << hook, lifecycle hook, "update" (Hmm.)
                    console.log('v-my-focus ? el.value ', el.value) // shows what is typed into input box, letter by letter f fr fre fren frenc french ...
//                    console.debug('v-MyFocus ? el.value ', el.value)
                    el.focus()
                }
            }
        }
    }
</script>