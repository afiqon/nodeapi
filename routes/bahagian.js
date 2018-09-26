const {connection, router} = require('../config');

//find Bahagian
router.get('/bahagian',  (req, res) => {
    var sql = "SELECT * FROM bahagian";

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