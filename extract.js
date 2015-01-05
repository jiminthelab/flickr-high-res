var Promise   = require('bluebird');
var https     = require('https');
var exec      = require('child_process').exec;
var fs        = Promise.promisifyAll(require('fs'));
var ensureDir = Promise.promisify(require('fs-extra').ensureDir);

// TODO: argv compulsory
var url             = process.argv[2];
var rawDataDir      = './tmp/rawData.html';
var filteredDataDir = './tmp/filteredData.js';

ensureDir('tmp')
  .then(cloningFlickrAlbum)
  .then(mkTempFileExportable);

function mkTempFileExportable() {
  exec([
    "sed ",
    "-e '/Y.listData/!d' ",
    "-e 's/Y.listData/module.exports.flickr/' ",
    rawDataDir
  ].join(''), puts);
}

function puts(error, stdout, stderr) {
  fs.writeFile(filteredDataDir, stdout, function(err) {
    if (err) console.log(err);
    else console.log("Data filtered.");
  });
}

function cloningFlickrAlbum() {
  return new Promise(function(resolve, reject) {

    var writable = fs.createWriteStream(rawDataDir);

    var req = https.get(url, function(res) {
      console.log('Cloning the album\'s code.');
      res.pipe(writable);

      res.on('end', function() {
        console.log('Filtering data.');
        resolve(res);
      });
    });

    req.end();

    req.on('error', function(e) {
      console.error(e);
      reject(e);
    });

  });
}