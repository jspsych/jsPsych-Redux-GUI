var express = require('express');
var fs = require('fs');

// Create our app using the express web application framework
var app = express();

// Set the port for the server to be availible on
const PORT = process.env.PORT || 3000;

// Forward users attempting to use https (Not currently supported)
app.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});

// Use the static files in the 'public' directory
app.use(express.static('public'));

// Listen on the designated port
app.listen(PORT, function() {
    console.log('Express server is up on port ' + PORT);
});