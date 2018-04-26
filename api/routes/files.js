const express = require('express');
const router = express.Router();

var filename = './upload/Sleep Away.mp3';
filename = './upload/TheRatNest Summer 2015.mp3';

var fs = require('fs');

// GET all products
router.get('/test', (req, res, next) => {
  var responseHeaders = {}
  var stat = fs.statSync(filename);

  var rangeRequest = readRangeHeader(req.headers['range'], stat.size);
  
  // If 'Range' header exists, we will parse it with Regular Expression.
  if (rangeRequest == null) {
    responseHeaders['Content-Type'] = 'audio/mpeg';
    responseHeaders['Content-Length'] = stat.size;  // File size.
    responseHeaders['Accept-Ranges'] = 'bytes';

    //  If not, will return file directly.
    sendResponse(res, 200, responseHeaders, fs.createReadStream(filename));
    return null;
  }

  var start = rangeRequest.Start;
  var end = rangeRequest.End;

  if (start === null && end === null) {
    //  If not, will return file directly.
    // res.writeHead(200, responseHeaders);
    res.header('Content-Type', 'audio/mpeg');
    res.header('Content-Length', stat.size);
    res.header('Accept-Ranges', 'bytes');
    res.send('OK');
    return null;
  }

  if (start >= stat.size || end >= stat.size) {
    // Indicate the acceptable range.
    responseHeaders['Content-Range'] = 'bytes */' + stat.size; // File size.

    // Return the 416 'Requested Range Not Satisfiable'.
    sendResponse(res, 416, responseHeaders, null);
    return null;
  }

  // Indicate the current range. 
  responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
  responseHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);
  responseHeaders['Content-Type'] = 'audio/mpeg';
  responseHeaders['Accept-Ranges'] = 'bytes';
  responseHeaders['Cache-Control'] = 'no-cache';

  // Return the 206 'Partial Content'.
  sendResponse(res, 206,
    responseHeaders, fs.createReadStream(filename, { start: start, end: end }));
});

function sendResponse(response, responseStatus, responseHeaders, readable) {
  response.writeHead(responseStatus, responseHeaders);

  if (readable == null)
      response.end();
  else
      readable.on('open', function () {
          readable.pipe(response);
      });

  return null;
}

function readRangeHeader(range, totalLength) {
  /*
   * Example of the method 'split' with regular expression.
   * 
   * Input: bytes=100-200
   * Output: [null, 100, 200, null]
   * 
   * Input: bytes=-200
   * Output: [null, null, 200, null]
   */

  if (range == null || range.length == 0)
    return null;

  var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
  var start = parseInt(array[1]);
  var end = parseInt(array[2]);
  var result = {
    Start: isNaN(start) ? 0 : start,
    End: isNaN(end) ? (totalLength - 1) : end
  };

  if (!isNaN(start) && isNaN(end)) {
    result.Start = start;
    result.End = totalLength - 1;
  }

  if (isNaN(start) && !isNaN(end)) {
    result.Start = totalLength - end;
    result.End = totalLength - 1;
  }

  // if (!isNaN(start) && start === 0 && isNaN(end)) {
  //   result.Start = null;
  //   result.End = null;
  // }

  return result;
}

module.exports = router;