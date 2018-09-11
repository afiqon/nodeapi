const {connection, router} = require('../config');

//find SUbjek
router.get('/subjek',  (req, res) => {
    var sql = "SELECT * FROM subjek";

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