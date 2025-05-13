const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let mongoose = require('mongoose');

app.use(cors())
// needed to use req.body, thanks https://expressjs.com/en/api.html#req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Schema for a user, contains username
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

let User = mongoose.model('User', userSchema);

// thanks https://zellwk.com/blog/async-await-express/ for async/await
// handles POST request to add a user
app.post('/api/users/', async (req, res) => {
  // get user id
  let id = await findUser(req.body.username);

  if (id === undefined) {
    // user not found, need to add, then return information
    // thanks https://stackoverflow.com/a/75783817 for then/catch
    User.insertOne({"name": req.body.username})
    .then(u => {
      res.json({
        "username": req.body.username,
        "_id": u._id
      });
    })
    .catch(err => {
      console.log(err);
    });
  } else {
    // user already esists so just return info
    res.json({
      "username": req.body.username,
      "_id": id
    });
  }
});

// handles GET request to return list of users
app.get('/api/users/', (req, res) => {
  // finds users, returns as an array of JSON objects
  User.find()
  .then(u => {
    let users = [];
    let index = 0;

    for (const user in u) {
      users[user] = {
        "_id": u[user]._id,
        "username": u[user].name,
        "__v": u[user].__v
      }
    }

    res.json(users);
  });
});

async function findUser (name) {
  // thanks https://stackoverflow.com/a/48433029 for handling user not found when destructuring
  let {_id} = await User.findOne({"name": name}) || "";

  return _id;
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
