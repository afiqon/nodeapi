const {connection, router} = require('../config');

//find SUbjek
router.get('/jadual',  (req, res) => {
    var query = req.query;
    
    var sql = "SELECT * FROM jadual";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
           console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});

router.get('/jadualKelas',  (req, res) => {
    var query = req.query;
    
    var sql = "SELECT DISTINCT kelas FROM jadual WHERE sesi="+query.id;

    connection.query(sql, function (err, rows, field) {
        if (!err) {
           console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});

router.get('/jadualHari',  (req, res) => {
    var query = req.query;
    
    var sql = "SELECT DISTINCT hari FROM jadual WHERE sesi="+query.sesi+" AND kelas="+query.kelas;

    connection.query(sql, function (err, rows, field) {
        if (!err) {
           console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});

router.get('/jadualSlot',  (req, res) => {
    var query = req.query;
    
    var sql = "SELECT DISTINCT slot FROM jadual WHERE sesi="+query.sesi+" AND kelas="+query.kelas+" AND hari='"+query.hari+"'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
           console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});

router.get('/jadualPelajar',  (req, res) => {
    var query = req.query;
    
    var sql = "SELECT id_pelajar,nama_pelajar FROM pelajar WHERE sesi="+query.sesi+ " AND kelas="+query.kelas;

    connection.query(sql, function (err, rows, field) {
        if (!err) {
           console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});

router.get('/getJadualID',  (req, res) => {
    var query = req.query;
    // "SELECT idj,id_pen FROM jadual  WHERE sesi=1 AND kelas=1 AND HARI='ISNIN' AND slot=1"
    var sql = "SELECT idj FROM jadual WHERE sesi="+query.sesi+ " AND kelas="+query.kelas+" AND slot="+query.slot+" AND hari='"+query.hari+"'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
           console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});

router.post("/saveKehadiran", function(req, res) {
    console.log(req.body);
    res.json(req.body);
    myArray=req.body;
    myArray.forEach(function(value){
        if(value.checked ==true) {
            var sql = "INSERT INTO ke (idj, id_p, kehadiran, tarikh ) VALUES ('" + value.idj + "', '" + value.id_pelajar + "', '/', '" + value.date + "')";
            connection.query(sql, function (err, rows, field) {
                if (!err) {
                    
                } else {
                    throw err;
                }
            });
        }
        else {
            var sql = "INSERT INTO ke (idj, id_p, kehadiran, tarikh ) VALUES ('" + value.idj + "', '" + value.id_pelajar + "', 'o', '" + value.date + "')";
            connection.query(sql, function (err, rows, field) {
                if (!err) {
                    
                } else {
                    throw err;
                }
            });
        }
        // console.log(value);
        
    });
  });

module.exports = router;