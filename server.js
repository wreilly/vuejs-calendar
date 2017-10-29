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


// LESSON 173 SSR
let myBundleRenderer; // just initialize var up here ...
// See below at two places:
// 1) require('webpack-server-compiler') ...
// 2) app.get('/') ...

app.get('/', (req, res) => {
  let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
  // LESSON 166
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace

    let contentMarker = '<!--PUTEVENTSHERE-FROMSERVER-->'
/* Forget it ...
    let contentMarker02 = '<!--PUTEVENTSHERE-FROMSERVER-FORCLIENTWEB-->'
*/
    if(myBundleRenderer) {
        // LESSON 175 - CONTEXT OBJECT (?).
        // We pass in here the "eventsOnServer":
        // I think (?) this is going to our NODE.ENTRY.JS. Hmm.
         myBundleRenderer.renderToString({ eventsOnServer }, (err, html) => {
            if(err) {
                console.log(err)
            } else {
              //  console.log(html)
                /* Gives us our "APP" <div>

                 <div id="app" data-server-rendered="true">
                   <div>
                     <div id="header">
                       <div><h3>Vue.js Calendar</h3></div>
...
                    <div id="event-form" style="top:450px;left:50px;"><h4>Add an event</h4>
                      <div class="text">
                        <div>Sunday, Oct 29th</div>
                      <input type="text" placeholder="Wild asparagus picking" value=""></div>
                      <div class="buttons">
                        <button type="submit">Save</button>
                      </div>
                       <button id="close-button">✕</button>
                     </div>
                   </div>
                 </div>
                 */

                // LESSON 174 SSR - We ADD the ${html} here! To get our whole rendered APP DIV to get served / rendered out to the browser get '/' request:
                let templateWithEvents = template.replace(contentMarker, `<script>var __INITIAL_STATE__ = ${ serialize(eventsOnServer)}</script>\n${html}`)
/* Forget it. Was trying to see if I could have the one index.html page do both Client/Web and Server/Node.
No.
I think we've changed it to be just Server/Node now, leaving behind the Client/Web mode.
I think.
No:
                let templateWithEvents02 = templateWithEvents.replace(contentMarker02, `<script>var __INITIAL_STATE__ = ${ serialize(eventsOnServer)}</script>\n${html}`)
 res.send(templateWithEvents02);
 */
                res.send(templateWithEvents);
            }
        })
    } else {
        // Bundle not yet rendered! (still working on it)
        res.send('<p>Awaiting compilation of our Bundle! (hmm, should you hit Refresh? dunno)</p>')
    }

    // res.send(template);

/*  LESSON 174 SSR We move this up inside if(myBundleRenderer)

THIS IS THE LINE THAT WAS USED FOR PLAIN OLD CLIENT RENDERING ETC:

    let templateWithEvents = template.replace(contentMarker, `<script>var __INITIAL_STATE__ = ${ serialize(eventsOnServer)}</script>`)


 res.send(templateWithEvents);
*/

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
        // LESSON 173
        // let myBundleRenderer = require('vue-server-renderer').createBundleRenderer(bundle)
        myBundleRenderer = require('vue-server-renderer').createBundleRenderer(bundle)
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
