// TODO: keep a long session or stream for mulit-users
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, initAuthenticated } = require('../config/auth');
const User = require('../models/User');
const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync();
const fs = require('fs');
const svg2img = require('svg2img');
const btoa = require('btoa');
var floydSteinberg = require('floyd-steinberg');
var PNG = require('pngjs').PNG;
var Jimp = require('jimp');

const attributes = {fill: 'red', stroke: 'black'};
const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};


var ascii = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p']

router.post('/', (req, res) => {
    console.log(req.body);
    var paper_id = req.body.paper_id;
    count = req.body.count

    function handle_bin_img(img){
        //img = img.bitmap.data;
        length = img.length
        var ret = ""
        temp_index = 1
        temp = 0
        for(let i=3; i < length; i+=4){
            if(img[i] == 0)
                temp += Math.pow(2, 3-(temp_index-1))
            if(temp_index % 4 == 0){
                temp_index = 1;
                ret += ascii[temp]
                temp = 0
                continue
            }
            temp_index++
        }
        console.log('ret')
        if(count == '1'){
          console.log('a');
          res.end(ret.substring(0,15000));
        }
        if(count==2) {
          console.log('b');
          res.end(ret.substring(15000,30000));
        }
        return ret;
    }

    // Search paper_id in db, if not find, then generate the image and encode
    User.findOne({ paper_id: paper_id }).then(user => {
    if (user) {
      // Find the item, and don't need to generate image
      res.end("Y");
    } else {
      if(count==='0')
        res.end("F");
      else{
        const svg = textToSVG.getSVG(paper_id, options);
        svg2img(svg, {'width':400, 'height':300} , function(error, buffer) {
            //returns a Buffer
            fs.writeFileSync('foo1.png', buffer);
        });



        fs.createReadStream('foo1.png').pipe(new PNG()).on('parsed', function() {
          handle_bin_img(floydSteinberg(this).data);
        })
      }
    }
  });
})

module.exports = router;