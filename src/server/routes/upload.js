const express = require('express');
const multer  = require('multer');
const stream = require('stream');
const neatCsv = require('neat-csv');
const converter = require('json-2-csv');
const Promise = require("bluebird");
const axios = require('axios');
const https = require('https');

const SEPARATOR = ";"                                           // delimeter for csv file
const PELIAS_BACKEND = process.env.PELIAS_URL                  // PELIAS backend
const MAX_PARALLEL_EXECUTIONS = 20                              // max of queries to backend in parallel
// create multer virtual storage for temporal storage before document is saved on mongo db
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// functions to create query urls for pelias based on querytype
function getPeliasUrls(elements, queryType) {
    let urls = []

    if(queryType === "Forward") {
        let url = PELIAS_BACKEND + "/search?text="
        elements.forEach(element => {
            if(element.address !== undefined) {
                urls.push(url + encodeURIComponent(element.address))
            }
        })
    } else {
        let url = PELIAS_BACKEND + "/reverse?"
        elements.forEach(element => {
            if(element.lon !== undefined && element.lat !== undefined) {
                urls.push(url + encodeURIComponent("point.lon=" + element.lon + "&point.lat=" + element.lat))
            }
        })
    }

    return urls
}

// convert the pelias output to the desired state
function convertPeliasOutput(responses, queryType) {
    let result = []

    responses.forEach(response => {
        let element = {}
        if(response.features[0]) {
            element.postalCode = response.features[0].properties.postalcode || ""
            element.country = response.features[0].properties.country || ""
            element.countryCode = response.features[0].properties.country_a || ""
            element.name = response.features[0].properties.name || ""
            element.street = response.features[0].properties.street || ""
            element.neighbourhood = response.features[0].properties.neighbourhood || ""
            element.region = response.features[0].properties.region || ""

            element.confidence = response.features[0].properties.confidence || ""

            // forward query has some more interesting information
            if(queryType === "Forward") {
                element.lon = response.features[0].geometry.coordinates[1] || ""
                element.lat = response.features[0].geometry.coordinates[0] || ""

                element.parsedText_PostalCode = response.geocoding.query.parsed_text.postalcode || ""
                element.parsedText_Street = response.geocoding.query.parsed_text.street || ""
                element.parsedText_Housenumber = response.geocoding.query.parsed_text.housenumber || ""
            }
        } else {
            element.postalCode = "not found"
            element.country = "not found"
            element.countryCode = "not found"
            element.name = "not found"
            element.street = "not found"
            element.neighbourhood = "not found"
            element.region = "not found"

            element.confidence = 0
        }

        result.push(element)
    })

    return result
}

// post method - to receive csv and process the pelias queries
router.post('/upload', upload.single("document"), (req, res, next) => {
    // read document using multer
    let content = req.file.buffer.toString('utf8')

    neatCsv(content, { separator: SEPARATOR })
    .then(elements => {
        let urls = getPeliasUrls(elements, req.body.queryType)

        if(urls.length > 0) {
            // even after injecting the ssl cert, somehow it doesn't allow it, so we are forced to disable ssl check
            const agent = new https.Agent({  
                rejectUnauthorized: false
            });

            // execute the requests using the concurrency manager bluebird
            return Promise.map(urls, url => axios.get(url, {httpsAgent: agent}), { concurrency: MAX_PARALLEL_EXECUTIONS})
            .then(data => {
                return data
            })
        } else {
            throw Error("Error when parsing document, no URLs could be generated")
        }
    })
    .then(result => {
        let output = []

        // format the output to a standard, so it can be beautified
        if(Array.isArray(result)) {
            // async results are each handled in an individual row of array
            result.forEach(element => {
               output.push(element.data)
            })
        } else {
            output.push(result.data)
        }

        output = convertPeliasOutput(output, req.body.queryType)

        // convert resulting json and return file
        converter.json2csv(output, (err, csv) => {
            // output document content as .txt
            let filename = "result"
            var fileContents = Buffer.from(csv, "utf8");

            var readStream = new stream.PassThrough();
            readStream.end(fileContents);
            
            res.set('Content-disposition', 'attachment; filename=' + filename);
            res.set('Content-Type', 'text/plain');
            
            readStream.pipe(res);
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
})

module.exports = router;