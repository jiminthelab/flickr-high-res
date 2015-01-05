var Promise   = require('bluebird');
var https     = require('https');
var exec      = require('child_process').exec;
var fs        = Promise.promisifyAll(require('fs'));
var ensureDir = Promise.promisify(require('fs-extra').ensureDir);

// TODO: argv compulsory
var url             = process.argv[2];
var rawDataDir      = './tmp/rawData.html';
var filteredDataDir = './tmp/filteredData.js';
var imageList       = [];
var date            = new Date();
var albumDir        = ['album',
                       date.getMonth(),
                       date.getDate(),
                       date.getHours(),
                       date.getMinutes(),
                       date.getSeconds()
                      ].join('');

ensureDir('tmp')
  .then(ensureDir(albumDir))
  .then(urlExists)
  .then(cloningFlickrAlbum)
  .then(mkTempFileExportable)
  .then(extractImageUrl)
  .then(initializeDownload);

function initializeDownload() {
  imageList.forEach(function(element, index) {

    var req = https.get(element, function(res) {

      var fileExtention = element.match(/\.[0-9a-z]+$/i);
      var imageData = '';

      res.setEncoding('binary');

      res.on('data', function(chunk) {
        imageData += chunk;
      });

      res.on('end', function() {
        fs.writeFile(albumDir + '/' + index + fileExtention,
                     imageData,
                     'binary',
                     function(err) {
          if (err) throw err;
          console.log('Image ' + index + fileExtention + ' copied.');
        });
      });

    });
  });
}

function extractImageUrl() {
  var file = require(filteredDataDir).flickr;

  // All rows
  file.rows.forEach(function(line) {
    // In all rows, each row
    line.row.forEach(function(picture) {
      if (!!picture.sizes.k) {
        imageList.push(picture.sizes.k.url);
      } else if (!!picture.sizes.h) {
        imageList.push(picture.sizes.h.url);
      } else if (!!picture.sizes.l) {
        imageList.push(picture.sizes.l.url);
      }
    });
  });
}

function mkTempFileExportable() {
  return new Promise(function(resolve, reject) {

    var execute = exec([
      "sed ",
      "-e '/Y.listData/!d' ",
      "-e 's/Y.listData/module.exports.flickr/' ",
      rawDataDir
    ].join(''), puts);

    execute.stdout.on('data', function(data) {
      resolve(data);
    });
  });
}

function puts(error, stdout, stderr) {
  fs.writeFile(filteredDataDir, stdout, function(err) {
    err ? console.log(err) : console.log("Data filtered.")
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

function urlExists() {
  return new Promise(function(resolve, reject) {
    url ? resolve(url) : console.log('The url is ' + url)
  });
}
