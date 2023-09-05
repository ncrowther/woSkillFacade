'use strict';

var path = require('path');
var fs = require('fs');
var https = require('http');

var oas3Tools = require('oas3-tools');
var serverPort = 8080; //8443;

// swaggerRouter configuration
var routerOptions = {     
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

// https configuration
var httpsOptions = {
    key: fs.readFileSync('./SSL/ntc-key.key', 'utf8'), 
    cert: fs.readFileSync('./SSL/ntc-crt.pem', 'utf8'), 
    ca: fs.readFileSync('./SSL/ca-crt.pem', 'utf8'),     
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), routerOptions);
var app = expressAppConfig.getApp();

// Initialize the Swagger middleware
https.createServer(httpsOptions, app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (https://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on https://localhost:%d/docs', serverPort);
});

