var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var http = require('http');
var url = process.argv[2];
var localDir = './tmp/listdata.js';

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

// var options = {
//   host: 'www.google.com',
//   port: 80,
//   path: '/upload',
//   method: 'get'
// };

// var req = http.request(options, function(res) {
//   res.setEncoding('utf8');
//   res.on('data', function (chunk) {
//     console.log(chunk);
//   });
// });

// req.on('error', function(e) {
//   console.log('problem with request: ' + e.message);
// });

// // write data to request body
// req.write('data\n');
// req.write('data\n');
// req.end();


var options = {
  host: 'www.flickr.com/photos/evanatwood/sets/72157629684278796/',
  port: 80
  // path: ''
};

http.get(options, function(res) {
  console.log("Got response: " + res.statusCode);

  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    console.log(chunk);
  });

}).on('error', function(e) {
  console.log("Got error: " + e.message);
});