const {connection, router} = require('../config');

//find Pelajar
router.get('/pelajar',  (req, res) => {
    var sql = "SELECT * FROM pelajar";

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