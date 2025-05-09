// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// endpoint to read dates from URL, in the format /api/:date?
app.get("/api/:inp", (req, res) => {
  // convert input to Date object
  // input is string so need to convert to number if it's a number
  const date = isNaN(req.params.inp) ? new Date(req.params.inp) : new Date(parseInt(req.params.inp));

  // thanks https://www.w3schools.com/jsref/jsref_obj_date.asp for Date methods
  if (date == "Invalid Date") {
    // input could not be parsed as date
    res.json({"error": "Invalid Date"});
  } else {
    // return date in milliseconds and formatted date
    res.json({
      "unix": Date.parse(date),
      "utc": date.toUTCString()
    });
  }
});

// endpoint when no input is given, in the format /api/
app.get("/api/", (req, res) => {
  // get current date
  const date = new Date();

  // return date in milliseconds and formatted date
  res.json({
    "unix": Date.parse(date),
    "utc": date.toUTCString()
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
