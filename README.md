# Dear souvenirs

# About

I had a friend in Umeå, a photographer, that stored all his pictures on Flickr,
and some on Facebook. There were over 2200 pictures, no way I download them one
by one. Back then, I just asked him his HD.  

This script allows you to download an entire Flickr album's high resolution 
picture by just inputing the album's URL. 

Flickr's html has a JavaScript variable called Y.listData. All pictures' url are
stored inside. What you want to retrive is stored in:

    Y.listData.rows[i].row[j].sizes

There are 11 picture sizes:

* k: large 2048px

* h: large 1600px

* l: Large 1024px

* c: medium 800px

* z: medium 640px

* m: medium 500px

* n: small 320px

* s: small 240px

* t: thumbnail 100px

* q: large square 150px

* sq: square 75px

We are interested in the l format and above.

# Quick Start

1. Use [npm](http://nodejs.org/).

2. Get the packages:

    `npm install`

3. Retrieve high resolution photos:

    `node extract.js https://www.flickr.com/photos/{username}/sets/{album number}/`