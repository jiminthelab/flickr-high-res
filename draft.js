var d = require('./tmp/listdata');

var fullPath = d.flickr;

var imgListK = [];
var imgListH = [];
var imgListL = [];

//all rows
fullPath.rows.forEach(function(e) {
  //in all rows, each row
  // console.log(e.row);
  e.row.forEach(function(i) {
    if (!!i.sizes.k) {
      console.log(i.sizes.k.url);
      imgListK.push(i.sizes.k.url);
    } else if (!!i.sizes.h) {
      console.log(i.sizes.h.url);
      imgListH.push(i.sizes.h.url);
    } else if (!!i.sizes.l) {
      console.log(i.sizes.l.url);
      imgListL.push(i.sizes.l.url);
    }
  });
});

console.log(imgListH);

