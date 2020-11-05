require('dotenv').config({ path: '.env' });

const port = process.env.SERVER_PORT || 8120;
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static folder for production
let publicFolder = path.resolve(__dirname, '..')
publicFolder = path.resolve(publicFolder, '..')
app.use(express.static(path.join(publicFolder, 'build')));

app.listen(port, () => {
  console.log(`geoencoding listening at http://localhost:${port}`)
})