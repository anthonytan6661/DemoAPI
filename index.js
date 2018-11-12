/*
 * primary file for the API
 *
 */

 // Dependencies
  var http = require('http');
  var https = require('https');
  var url = require('url');
  var StringDecoder = require('string_decoder').StringDecoder;
  var config = require('./config');
  var fs = require('fs');

// Instantiate the HTTP server
  var httpServer = http.createServer(function(req,res){
      unifiedServer(req,res);
  });
// Instantiate the HTTPS server
  var httpsServerOptions = {
      'key' : fs.readFileSync('./https/key.pem'),
      'cert' : fs.readFileSync('./https/cert.pem')
  };
// Create the Unified Server
  var httpsServer = https.createServer(httpsServerOptions, function(req,res){
      unifiedServer(req,res);
  });
//start the HTTP server
  httpServer.listen(config.httpPort,function(){
     console.log("this server is listening on port "+config.httpPort+" in "+config.envName +" mode");
  });
//start the HTTPS server
  httpsServer.listen(config.httpsPort,function(){
      console.log("this server is listening on port "+config.httpsPort+" in "+config.envName +" mode");
  });

// All the server logic for both the http and https server
  var unifiedServer = function(req,res){
// get the url and parse it
  var parsedUrl= url.parse(req.url,true);
//get the path
  var path = pathUrl= parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

// get the query string as an object
  var queryStringObject = parsedUrl.query;

// get the HTTP method
  var method = req.method.toLowerCase();

// get the headers as an object
  var headers = req.headers;

//get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data){
    buffer+= decoder.write(data);
  });

  req.on('end',function(){
    buffer+= decoder.end();
    // chooese the handler this request should go to, if one is no found
    var chosenHandler = typeof(router[trimmedPath]) !=='undefined' ? router[trimmedPath] : handlers.notFound;

    //contruct the data object to send to the handlers
    var data ={
      'trimmedPath' : trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload' : buffer
    };

    //route the request to the handler specified in the router
    chosenHandler(data,function(statusCode,payload){
      // use the status code calledback by the handler, or default to 200
       statusCode = typeof(statusCode)=='number' ? statusCode : 200;

      // use the payload called back by the handler, or default to empty object
       payload = typeof(payload) =='object' ? payload : {};

      // Conver the payload to a string
       var payloadString = JSON.stringify(payload);

      // Return the response
       res.setHeader('Content-Type','application/json');
       res.writeHead(statusCode);
       res.end(payloadString);
      //log the request path
       console.log('returning this response :',statusCode.payloadString);
     });
   });
 };

// Define the handlers
var handlers ={};

handlers.ping = function(data,callback){
  callback(200);
};

handlers.hello = function(data,callback){
  callback(200, {'message' :'hello there, you success to get my welcome message'});
}

// Not found handler
handlers.notFound = function(data,callback){
 callback(404);
};

// Define a request router
 var router ={
   'ping' : handlers.ping,
   'hello': handlers.hello
 };
