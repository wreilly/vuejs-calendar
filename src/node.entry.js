// This is in BOTH NODE.entry.js AND WEB.entry.js
import MyVueCalendar from './entry'

export default function() {
    return MyVueCalendar([]) // << We will pass in Events ...
}


