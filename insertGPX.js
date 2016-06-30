var fs = require('fs');
var cheerio = require('cheerio');
var $ = cheerio.load(fs.readFileSync('routing_points.xml'));

console.log($('routing_points').find('set').first().html());