const {connection, router} = require('../config');

//find Sesi
router.get('/sesi',  (req, res) => {
    var sql = "SELECT * FROM sesi";

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