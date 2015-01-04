// https is port 443, http is port 80
var https = require('https');
var fs = require('fs');

var url = process.argv[2];
var localDir = './tmp/listdata.html';
var datastream;

var req = https.get(url, function(res) {
  res.on('data', function(d) {
    datastream += d;
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
});

// temporary hack, promises yet to come
setTimeout(function() {
  fs.writeFile(localDir, datastream, function(err) {
    if (err) console.log(err);
    else console.log('Temp file created.');
  });
}, 2000);
