// https is port 443, http is port 80
var https = require('https');
var fs = require('fs');

var url = process.argv[2];
var writable = fs.createWriteStream('./tmp/listdata.html');

var req = https.get(url, function(res) {
  res.pipe(writable);
});
req.end();

req.on('error', function(e) {
  console.error(e);
});
