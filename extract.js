var Promise   = require('bluebird');
var https     = require('https');
var exec      = require('child_process').exec;
var Jetty     = require('Jetty');
var fs        = Promise.promisifyAll(require('fs'));
var ensureDir = Promise.promisify(require('fs-extra').ensureDir);
var ensureFile = Promise.promisify(require('fs-extra').ensureFile);

// TODO: argv compulsory
var url             = process.argv[2];
var rawDataDir      = './tmp/rawData.html';
var filteredDataDir = './tmp/filteredData.js';
var imageList       = [];
var jetty           = new Jetty(process.stdout);
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

function urlExists() {
    url ? Promise.resolve(url) : console.log('The url is ' + url)
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
      reject(e);
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

    execute.stderr.on('err', function(err) {
      reject(err);
    });

    // TODO: Temp hack
    setTimeout(function() {
      resolve();
    }, 2000);
  });
}

function puts(error, stdout, stderr) {
  fs.writeFile(filteredDataDir, stdout, function(err) {
    err ? console.log(err) : jetty.clear();
  });
}

function extractImageUrl() {
  var file = require(filteredDataDir).flickr;

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

  Promise.resolve();
}

function initializeDownload() {
  imageList.forEach(function(element, index) {

    var req = https.get(element, function(res) {

      var fileExtention = element.match(/\.[0-9a-z]+$/i);
      var imageData = '';

      res.setEncoding('binary');

      res.on('data', function(chunk) {
        jetty.moveTo([index,0]);
        jetty.text(
          index + ': ' + Math.round(
            imageData.length / res.headers['content-length'] * 100) + '%'
          );
        imageData += chunk;
      });

      res.on('error', function(e) {
        Promise.reject(e);
      });

      res.on('end', function() {
        fs.writeFile(albumDir + '/' + index + fileExtention,
                     imageData,
                     'binary',
                     function(err) {
          if (err) throw err;
          jetty.moveTo([index, 50]);
          jetty.text('Image ' + index + fileExtention + ' copied.');
        });
      });

    });
  });
}