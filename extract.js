var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var rp = require('request-promise');

// 1. Get the URL fmor the terminal
var url = process.argv[2];
var localDir = './tmp/listdata.js';

// 2. Save it to a local directory
function puts(error, stdout, stderr) {
  sys.puts(stdout);
  fs.writeFile(localDir, stdout, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Temp file created.");
    }
  });
}

// Extract the interesting part

function getData(callback) {
  exec("sed -e '/Y.listData/!d' -e 's/Y.listData/module.exports.flickr/' " + url, puts);
}

