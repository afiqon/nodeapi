const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var state = {
    pool: null
};
var PORT = 1440;
var HOST = 'localhost';
var USER = 'root';
var DB = 'eattendance';
state.pool = mysql.createPool({
    connectionLimit: 100,
    user: USER,
//   host: '127.0.0.1', //ip
    host: HOST,
//   password: 'p455w0rd',
    password: '',
    database: DB,
    debug: true
});

var connection = state.pool;

module.exports = {
    connection,
    router,
};