var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});
            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
var PORT = 1440;
const subjek = require('./routes/subjek');
const login = require('./routes/login');
const jadual = require('./routes/jadual');
const bahagian = require('./routes/bahagian');
const jawatan = require('./routes/jawatan');
const pelajar = require('./routes/pelajar');
const pengajar = require('./routes/Pengajar');
const Sesi = require('./routes/Sesi');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Subjek
app.use('/api', subjek);
//Login
app.use('api', login);
//Jadual
app.use('api', jadual);
//Bahagian
app.use('api', bahagian);
//Jawatan
app.use('api', jawatan);
//Pelajar
app.use('api', pelajar);
//Pengajar
app.use('api', pengajar);
//Sesi
app.use('api', Sesi);

//find_user_by_id
// app.get('/user_id', function (req, res) {
//     var query = req.query;

//     var sql = "SELECT * FROM sys_user WHERE usr_id = '" + query.id + "'";

//     connection.query(sql, function (err, rows, field) {
//         if (!err) {
//             res.json({code: '00', content: rows});
//         } else {
//             throw err;
//         }
//     });
// });

//find_user_ilp
// app.get('/user_id_ilp', function (req, res) {
//     var query = req.query;

//     var sql = "SELECT * FROM tbl_ilp WHERE usr_id = '" + query.id + "'";

//     connection.query(sql, function (err, rows, field) {
//         if (!err) {
//             res.json({code: '00', content: rows});
//         } else {
//             throw err;
//         }
//     });
// });

console.log("Server listening on port " + PORT);
app.listen(PORT);

