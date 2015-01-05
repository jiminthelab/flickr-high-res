var https   = require('https');
var fs      = require('fs');
var exec    = require('child_process').exec;
var Promise = require('bluebird');

// TODO: argv compulsory
var url             = process.argv[2];
var rawDataDir      = './tmp/rawData.html';
var filteredDataDir = './tmp/filteredData.js';

fs.mkdir('tmp', 0777, function(err) {
  // If the directory doesn't exist, create it. If it exists, use it.
  console.log('Using the "tmp" directory.');
  if (err === 'EEXIST') console.log(err);
});

getUrl().then(function() {
  // Get the URL, then filter the data.
  exec([
    "sed ",
    "-e '/Y.listData/!d' ",
    "-e 's/Y.listData/module.exports.flickr/' ",
    rawDataDir
  ].join(''), puts);
});

function puts(error, stdout, stderr) {
  fs.writeFile(filteredDataDir, stdout, function(err) {
    if (err) console.log(err);
    else console.log("Data filtered.");
  });
}

function getUrl() {
  return new Promise(function(resolve, reject) {

    var writable = fs.createWriteStream(rawDataDir);
    var req = https.get(url, function(res) {
      res.pipe(writable);
      console.log('Cloning the album\' code.');

      res.on('end', function() {
        resolve(res);
        console.log('Filtering data.');
      });
    });

    req.end();

    req.on('error', function(e) {
      console.error(e);
      reject(e);
    });

  });
}
