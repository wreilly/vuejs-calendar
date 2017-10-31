// This is in BOTH NODE.entry.js AND WEB.entry.js
import MyVueCalendar from './entry'

// LESSON 175
// Ye Gods, Momentizing again
import moment from 'moment-timezone'
moment.tz.setDefault('UTC') // set default time on browser


/*
LESSON 175  ~02:33
"When the server calls the node.entry.js file ..."
(Hmm, where (exactly) is that?)
"... it passes through this object we can call 'context'"
SERVER.JS
app.get('/') calls this < ??
 */
export default function(wr__context) {

    /* (I think)
     Here in NODE.ENTRY.JS we have wr__dates that are just Strings.
     Need to "Momentize()" (like we do in WEB.ENTRY.JS) (and NODE.ENTRY.JS and in STORE/INDEX.JS
     https://www.udemy.com/vuejs-2-essentials/learn/v4/questions/2304096
     */
    let wr__ContextEventsAsMomentObjectsFromEventsOnServer = wr__context.eventsOnServer.map(function(eachEvent) {
        let eventIReturn = {}
        let momentizedDate = moment(eachEvent.wr__date)
        eventIReturn.wr__date = momentizedDate // <<<<< Better. Put Moment object on *new* Event object, to be returned to the *new* array (leave original array UNCHANGED)
        eventIReturn.description = eachEvent.description
        return eventIReturn
    })



    console.log('oy vay. wr__context.eventsOnServer: ', wr__context.eventsOnServer)
/*
 oy vay. wr__context.eventsOnServer:  [ { description: 'yeah 0', wr__date: '2017-10-13T00:00:00.000Z' } ]
 */

    console.log('oy vay -02-. wr__ContextEventsAsMomentObjectsFromEventsOnServer: ', wr__ContextEventsAsMomentObjectsFromEventsOnServer)


 //   return MyVueCalendar([]) // << We will pass in array of Events ...
    // return MyVueCalendar(wr__context.eventsOnServer) //
    return MyVueCalendar(wr__ContextEventsAsMomentObjectsFromEventsOnServer)

}


