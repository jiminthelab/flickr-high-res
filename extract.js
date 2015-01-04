var https = require('https');

var url = process.argv[2];

var req = https.get(url, function(res) {
  res.on('data', function(d) {
    process.stdout.write(d);
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
});
