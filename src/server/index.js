require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = process.env.SERVER_PORT || 8120;
const path = require('path');
const api = require('./routes/upload')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true
}));
app.use(bodyParser.json({limit: "50mb", extended: true}));

// serve static folder for production
let publicFolder = path.resolve(__dirname, '..')
publicFolder = path.resolve(publicFolder, '..')
app.use('/api', api)

// serve static folder for production
publicFolder = path.resolve(__dirname, '..')
publicFolder = path.resolve(publicFolder, '..')
app.use(express.static(path.join(publicFolder, 'build')));

app.listen(port, () => {
  console.log(`geoencoding listening at http://localhost:${port}`)
})

// forward all requests to the react app
app.get('*', function(req, res) {
  console.log(req.url)
  res.sendFile(path.join(publicFolder, 'build', 'index.html'));
});