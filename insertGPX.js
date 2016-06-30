/*

 To Run:
 ```
    node insertGPX.js <your_gpx_file>
 ```
*/

/*
A GPX file is an XML file. Link to full spec here:
https://en.wikipedia.org/wiki/GPS_Exchange_Format
*/

var execSync = require('child_process').execSync;
var fs = require('fs');
var cheerio = require('cheerio');

// http://stackoverflow.com/questions/31574127/node-js-cheerio-parser-brakes-uft-8-encoding
var CHEERIO_OPTIONS = {
    decodeEntities: false
};

var XML$ = cheerio.load(fs.readFileSync('routing_points.xml'), CHEERIO_OPTIONS);
var GPX$ = cheerio.load(fs.readFileSync(process.argv[2]), CHEERIO_OPTIONS);

var RANDOM_SAMPLING_PERCENT = parseFloat(process.argv[3]);
// Keep all way-points if random sampling threshold is not specified.
if (isNaN(RANDOM_SAMPLING_PERCENT)) {
    RANDOM_SAMPLING_PERCENT = 1;
}

// Backup
execSync('cp -f routing_points.xml routing_points.bak.xml');

// Convert LatLng as decimal to LatLng as milliseconds
function DEC_to_MS(deg) {
    return Math.round(deg * 60 * 60 * 1000);
}

// Create new doc to be appended
var newSet$ = cheerio.load([
    '<set>',
    '<name></name>',
    '</set>'
].join(''));

var $set = newSet$('set');

// Update set name
var name = GPX$('trk').find('name').text();
$set.find('name').html(name);

// Add way points
var $trkpt = GPX$('trkpt');
var lastTrackpointIndex = $trkpt.length - 1;

var trackXML = $trkpt.map(function addTrackPointAsWayPoint(i) {
    var $this = GPX$(this);
    var lat = DEC_to_MS(parseFloat($this.attr('lat')));
    var lon = DEC_to_MS(parseFloat($this.attr('lon')));

    if (i === 0) {
        return [
            '<departure>',
            '<name>Start</name>',
            '<lat>' + lat + '</lat>',
            '<lon>' + lon + '</lon>',
            '</departure>'
        ].join('');
    } else if (i === lastTrackpointIndex) {
        return [
            '<destination>',
            '<name>End</name>',
            '<lat>' + lat + '</lat>',
            '<lon>' + lon + '</lon>',
            '</destination>'
        ].join('');
    } else {
        if (Math.random() < RANDOM_SAMPLING_PERCENT) {
            return [
                '<waypoint>',
                '<name>Waypoint ' + i + '</name>',
                '<lat>' + lat + '</lat>',
                '<lon>' + lon + '</lon>',
                '</waypoint>'
            ].join('');
        }
    }
}).get();

trackXML = trackXML.filter(Boolean);

console.log('Adding a route with ' + trackXML.length + 'waypoint(s)...');

$set.append(trackXML.join('\n'));

XML$('routing_points').append($set);

// Write the new routing_points.xml

fs.writeFileSync('routing_points.xml', XML$.xml());