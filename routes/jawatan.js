const {connection, router} = require('../config');

//find Jawatan
router.get('/jawatan',  (req, res) => {
    var sql = "SELECT * FROM jawatan";

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