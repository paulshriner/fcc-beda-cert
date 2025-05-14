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

// Schema for an exercise, contains id, description, duration, and date
const exerciseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

let Exercise = mongoose.model('Exercise', exerciseSchema);

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
      res.json({"error": "User creation failed!"});
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
  })
  .catch(err => {
    console.log(err);
    res.json({"error": "No users found!"});
  });
});

// handles POST request to add exercise
app.post('/api/users/:_id/exercises/', (req, res) => {
  // check date, if invalid or blank set to today's date
  let date = new Date(req.body.date);
  if (date == "Invalid Date") {
    date = new Date();
  }

  if (req.body.description == "") {
    res.json({"error": "Description cannot be blank!"});
  } else if (isNaN(req.body.duration) || req.body.duration < 0) {
    res.json({"error": "Duration cannot be non-numeric or less than 0!"});
  } else {
    // find user, insert exercise, then return response with exercise info
    User.findById(req.params._id)
    .then(u => {
      if (u === null) {
        res.json({"error": "No user with this ID exists!"});
      } else {
        Exercise.insertOne({
          "id": req.params._id,
          "description": req.body.description,
          "duration": req.body.duration,
          "date": date
        })
        .then(e => {
          res.json({
            "_id": u._id,
            "username": u.name,
            "date": date.toDateString(),
            "duration": parseInt(req.body.duration),
            "description": req.body.description
          });
        })
        .catch(err => {
          console.log(err);
          res.json({"error": "Could not insert exercise!"});
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({"error": "No user with this ID exists!"});
    });
  }
});

// handles GET request to retrieve exercise logs
app.get('/api/users/:_id/logs', (req, res) => {
    // find user by id, if not found return error
    User.findById(req.params._id)
    .then(u => {
      if (u === null) {
        res.json({"error": "No user with this ID exists!"});
      } else {
        // user found, so find corresponding exercises, then return formatted data
        Exercise.find({"id": u._id})
        .then(data => {
          res.json({
            "_id": u._id,
            "usename": u.name,
            "count": data.length,
            "log": data.map(e => ({
              "description": e.description,
              "duration": e.duration,
              "date": new Date(e.date).toDateString()
            }))
          });
        })
        .catch(err => {
          console.log(err);
          res.json({"error": "Could not find exercises!"});
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({"error": "No user with this ID exists!"});
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
