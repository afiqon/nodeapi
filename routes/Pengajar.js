const {connection, router} = require('../config');

//find Pengajar
router.get('/pengajar',  (req, res) => {
    var sql = "SELECT * FROM pengajar";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
//            console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});

module.exports = router;