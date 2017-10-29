require('dotenv').config({ silent: true });

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');

// "Moment.js" is not really needed here. Only when we were putting in dummy entries for events.
const moment = require('moment-timezone')
moment.tz.setDefault('UTC') // set default time on browser

const serialize = require('serialize-javascript')
// https://www.npmjs.com/package/serialize-javascript


app.use(require('body-parser').json())

// ENV DEVELOPMENT
app.use('/public', express.static(path.join(__dirname, 'public')));

// ENV PRODUCTION: (Web, not Node server-side) ("MBU")
// This did put it into "Production" (per Vue in the browser) ... So, leaving commented out for now.
// app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
  // LESSON 166
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
    let contentMarker = '<!--PUTEVENTSHERE-FROMSERVER-->'

    // res.send(template);

    let templateWithEvents = template.replace(contentMarker, `<script>var __INITIAL_STATE__ = ${ serialize(eventsOnServer)}</script>`)

    res.send(templateWithEvents);


});

/* TEMPORARY
Server-Side rendering intro etc. LESSON 169
SCRATCH.HTML
 */
app.get('/scratch', (req, res) => {
    let serverSideTemplate = fs.readFileSync(path.resolve('./scratch.html'), 'utf-8');
    res.send(serverSideTemplate);
});


app.get('/events', (req, res) => {

    /* WR__ "Extra Credit" (!) :o)
    Scenario:
    User clicks our "Sync!" "!" button. Wishes to get this browser's Events updated. (In case there were Events entered on a different browser or computer.)

    Req:
    No parameters nor headers nor anything sent.

    Res:
    This API call returns ALL Events on Server

    Client:
    Calling client will simply (brute force) whamma-jamma them all onto the Store's state.
     */
    res.send(eventsOnServer)

})

// LESSON 159
// LESSON 166 hmm, Q. Does it need a dummy one ? A. No, it don't.
// let eventsOnServer = [] // << No dummy? << Works a-ok
// Hmm, with EMPTY array I get: from console.log over in WEB.ENTRY.JS:
// "TypeError: window.__INITIAL_STATE__[0] is undefined"  << Yeah yeah, that's because you're asking for the [0]th element of an empty array. Knock it off awready!
/*  Not needed this dummy one: */

/*
Looks like, way out here on server, if you want to
 */
let eventsOnServer = [ // You CAN make this empty, squire. []
    { description: 'yeah 0', wr__date: "2017-10-13T00:00:00.000Z" }
]
/*
let eventsOnServer = [
    { description: 'yeah 0', wr__date: moment("2017-10-13T00:00:00.000Z") }
]
*/





app.post('/add_event', (req, res) => {
    console.log('received ! req.body: ', req.body)
    /*
    E.g. { description: 'oh come on!',
     wr__date: '2017-10-17T00:00:00.000Z' }
     */
    eventsOnServer.push(req.body)
    console.log('eventsOnServer is now: ', eventsOnServer)
    /*
     received ! req.body:  { description: 'is here', wr__date: '2017-10-27T00:00:00.000Z' }
     eventsOnServer is now:  [ { description: 'nobody', wr__date: '2017-10-24T00:00:00.000Z' },
     { description: 'is here', wr__date: '2017-10-27T00:00:00.000Z' } ]
     */

    res.sendStatus(200)
})

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
    console.log('YEAH WE\'RE IN *DEVELOPMENT* (see .env) webpack-dev-middleware ')
  const reload = require('reload');
  const reloadServer = reload(server, app);
  require('./webpack-dev-middleware').init(app);

  // SSR. LESSON 172
    require('./webpack-server-compiler').init(function(bundle) {
        console.log('SSR Node bundle built or so we\'re told: ') //, bundle) // << Whoa that's alotta code (MBs of code)
    })
}

server.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
  if (process.env.NODE_ENV === 'development') {
      console.log('YEAH WE\'RE IN *DEVELOPMENT* (see .env) open localhost ... ')
      // require("open")(`http://localhost:${process.env.PORT}`); // defaults to Opera (for me)
// No grazie.      require("open")(`http://localhost:${process.env.PORT}`, "firefoxdeveloperedition"); // hey! worked.
      // require("open")(`http://localhost:${process.env.PORT}`, "google chrome"); // hey! worked.
  }
});
