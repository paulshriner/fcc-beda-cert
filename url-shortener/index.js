require('dotenv').config();
const express = require('express');
const cors = require('cors');
// thanks https://www.geeksforgeeks.org/node-js-dns-lookup-method/ for dns
const dns = require('dns');
const app = express();

// Thanks https://stackoverflow.com/a/14939404 for reading/writing to file
const fs = require("fs");

// Basic Configuration
const port = process.env.PORT || 3000;

// Regex to remove http/https from URL, thanks https://stackoverflow.com/a/53697710
const REMOVE_BEGIN_URL = /^https?:\/\//i;
const REMOVE_END_URL = /[/].*$/; // Thanks https://superuser.com/a/739939

app.use(cors());
// needed to use req.body, thanks https://expressjs.com/en/api.html#req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Handles POST request for URL submission
app.post('/api/shorturl/', (req, res) => {
  // Prepare URL for verifying with DNS lookup
  let testURL = req.body.url.replace(REMOVE_BEGIN_URL, '');
  testURL = testURL.replace(REMOVE_END_URL, '');
  
  dns.lookup(testURL, {all: true}, (error, address) => {
    if (error) {
      res.json({"error": "invalid url"});
    } else {
      let urlJSON = {};
      
      // read in URLs from file
      // thanks https://www.geeksforgeeks.org/node-js-fs-readfile-method/, https://www.geeksforgeeks.org/node-js-fs-writefile-method/
      // for further help with readFile and writeFile
      fs.readFile('./url.json', 'utf8', (err, data) => {
        // convert from string to JSON
        if (!err) {
          urlJSON = JSON.parse(data);
        }

        // add URL if needed
        if (!urlJSON[req.body.url]) {
          urlJSON[req.body.url] = Object.keys(urlJSON).length + 1;
        }

        // save file
        fs.writeFile('./url.json', JSON.stringify(urlJSON), 'utf8', err => {});

        res.json({
          "original_url": req.body.url,
          "short_url": urlJSON[req.body.url]
        }); 
      });
    } 
  });
});

// Handles /api/shorturl/...
app.get('/api/shorturl/', (req, res) => {
  res.json({"req": "req"});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
