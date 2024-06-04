const express = require('express');
const app = express();
const { mongoUrl } = require('./keys');
const port = process.env.PORT || 5000; // Ensure PORT is uppercase
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Middleware to redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
});

app.use(cors());
require('./models/model');
require('./models/post');
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/createpost'));
app.use(require('./routes/user'));

mongoose.connect(mongoUrl);

mongoose.connection.on('connected', () => {
  console.log("Connection established");
});

mongoose.connection.on('error', () => {
  console.log("Not connected");
});

// Serving the frontend
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
