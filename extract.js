var https = require('https');
var fs    = require('fs');
var exec  = require('child_process').exec;

var url             = process.argv[2];
var rawDataDir      = './tmp/rawData.html';
var filteredDataDir = './tmp/filteredData.js';
var writable        = fs.createWriteStream(rawDataDir);


var req = https.get(url, function(res) {
  res.pipe(writable);
  console.log('Temp file created.');
});
req.end();

req.on('error', function(e) {
  console.error(e);
});

// temp hack
setTimeout(function() {
  exec([
    "sed ",
    "-e '/Y.listData/!d' ",
    "-e 's/Y.listData/module.exports.flickr/' ",
    rawDataDir
  ].join(''), puts);
}, 2500);

function puts(error, stdout, stderr) {
  fs.writeFile(filteredDataDir, stdout, function(err) {
    if (err) console.log(err);
    else console.log("Temp file created.");
  });
}