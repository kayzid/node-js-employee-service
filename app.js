'use strict';

const express = require('express');
const expressValidator = require('express-validator');
const employeeRoutes = require('./routes/employee');

const app = express();
const port = parseInt(process.env.PORT || '3000');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/v1/api/employees', employeeRoutes);

// Fail over route
app.use(function(req, res) {
    res.status(404).send('Not found');
});

// listen for requests
app.listen(port, function() {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app;
