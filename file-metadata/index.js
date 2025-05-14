var express = require('express');
var cors = require('cors');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// handles submitting form with uploaded file
// thanks https://www.npmjs.com/package/multer for multer usage
app.post('/api/fileanalyse/', upload.single('upfile'), (req, res) => {
  if (req.file == null) {
    // user clicked on upload without choosing file
    res.json({"error": "No file uploaded!"});
  } else {
    // file exists, grab necessary information and return to user
    res.json({
      "name": req.file.originalname,
      "type": req.file.mimetype,
      "size": req.file.size
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
