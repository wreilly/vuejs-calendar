require('dotenv').config({ silent: true });

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');

// ENV DEVELOPMENT
app.use('/public', express.static(path.join(__dirname, 'public')));

// ENV PRODUCTION: (Web, not Node server-side) ("MBU")
// This did put it into "Production" (per Vue in the browser) ... So, leaving commented out for now.
// app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
  res.send(template);

});

// LESSON 159
let eventsOnServer = []

app.use(require('body-parser').json())

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
