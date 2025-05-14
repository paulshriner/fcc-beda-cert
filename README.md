# freeCodeCamp Back End Development and APIs Certificate

These are the projects I did in the completion of this certificate.

[Here](https://www.freecodecamp.org/certification/fcc30aca8b2-d2c4-4009-a397-2e6d1ecbde3b/back-end-development-and-apis) is my certificate on freeCodeCamp.

## Projects

### Timestamp Microservice

Parses input from the URL with the JavaScript Date() method, returns as a JSON object milliseconds and formatted date, or an error on invalid input.

### Request Header Parser Microservice

Parses IP address, language, and user-agent from the request object and returns as a JSON object.

### URL Shortener Microservice

Creates short URLs that navigate to the original URL. Short URL information is saved in JSON format in a file, which is read in to find where to navigate to or added to when creating a new short URL.

### Exercise Tracker

Tracks exercises by description, duration, and date. Exercises are tied to a username. Data is stored using a database on MongoDB. GET queries can be used to retrieve a list of users and a user's exercise log (which can be narrowed down by date range and quantity).

### File Metadata Microservice

Returns metadata for a file uploaded via a form. The multer npm package is used for handling file uploading.

## Skills

- Node.js
- Express
- MongoDB
- Mongoose
- Multer

## Development Tools

- [VS Code](https://code.visualstudio.com/) - Development environment
- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [Git](https://git-scm.com/)/[GitHub](https://github.com/) - Version control
- [MongoDB Atlas](https://www.mongodb.com/) - Provides the database used

## Running the Projects

You will need node.js installed. To run a project, navigate to the project folder, open a terminal window, then type ```npm install```, then ```npm start```. This will start a local server that can be viewed in a web browser.

The exercise-tracker project requires a database on MongoDB Atlas. [Here](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/) is a guide to create an account and set up a database. Once you have your URI string, create a file called .env in the project folder, then assign the URI string to MONGO_URI.
