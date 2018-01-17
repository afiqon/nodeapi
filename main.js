var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});
            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
var state = {
    pool: null
};
var PORT = 1440;
var HOST = 'localhost';
var USER = 'root';
var DB = 'spip';
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBrDoIGwWD7SAJ508pyB7rQ__4xmJawDdo'
});
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


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'afiqonx@gmail.com',
    pass: 'fahima98'
  }
}));
//email
 app.post('/mail', function (req, res) {
    var mailOptions = {
  from: req.body.aduan,
  to: 'afiqon@gmail.com',
  subject: 'Aduan/Pertanyaan',
  text: 'No tel: '+ req.body.phone+' Email: '+ req.body.email+' Aduan: '+ req.body.aduan
};
    transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
  console.log(req.body);
}); 
});
//find_all
app.get('/user', function (req, res) {
    var sql = "SELECT * FROM sys_user";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
//            console.log('rows: ', rows);
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//find_user_by_id
app.get('/user_id', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM sys_user WHERE usr_id = '" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});
app.get('/geo', function (req, res) {
    var query = req.query;

 googleMapsClient.geocode({
  address: query.id,
  components: {
    country: 'MY'
  }
}, function(err, response) {
  if (!err) {
    res.json(response.json.results);
    console.log(response.json.results);
  }
});
});


//find_user_ilp
app.get('/user_id_ilp', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM tbl_ilp WHERE usr_id = '" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//orang awam ilp find by all
app.get('/awam_ilp', function (req, res) {
    var query = req.query;
    if(query.key){
    var sql = "SELECT company_name,usr_id,company_address FROM tbl_ilp_application WHERE company_name LIKE '%"+query.key+"%'";
        }
    else{
        var sql = "SELECT company_name,usr_id,company_address FROM tbl_ilp_application";
    }
    connection.query(sql, function (err, rows, field) {
        if (!err) {
//            console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});
app.get('/awam_ilp_negeri', function (req, res) {
    var query = req.query;
    var sql = "SELECT company_name,usr_id,company_address FROM tbl_ilp_application WHERE state_id='"+query.id+"'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
//            console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});
//ilp by daerah
app.get('/awam_ilp_daerah', function (req, res) {
    var query = req.query;
    var sql = "SELECT company_name,usr_id,company_address FROM tbl_ilp_application WHERE region_id='"+query.id+"'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
//            console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
})
//detail ilp
app.get('/paparan_awam_ilp', function (req, res) {
    var query = req.query;
    var sql = "SELECT a.company_name,a.company_address,a.postcode,a.company_phone,DATE_FORMAT(b.license_end,'%d-%m-%Y')license_end FROM tbl_ilp_application a INNER JOIN tbl_ilp b ON a.usr_id=b.usr_id WHERE a.usr_id='"+query.id+"'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
//            console.log('rows: ', rows);
            res.json(rows);
        } else {
            throw err;
        }
    });
});


//list_permit_mengajar
app.get('/api_senarai_permit_mengajar', function (req, res) {
    var query = req.query;

    var sql = "SELECT name FROM tbl_ilp_permit_application";

    connection.query(sql, function (err, rows, field) {//
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//find_ilp_by_negeri
//taktau negeri di table mana
app.get('/find_ilp_by_state', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM tbl_ilp_application WHERE state_id = '" + query.state_id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//select status all ilp pengajar
app.get('/api_ilp_status_permit_mengajar', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM tbl_ilp_permit_application";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//status by id
app.get('/api_ilp_status_permit_mengajar_id', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM tbl_ilp_permit_application WHERE usr_id = '" + query.usr_id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});

//permohonan_lesen_baru
app.post('/api_ilp_permohonan_lesen_baru', function (req, res) {
    var reqBody = req.body;

    console.log('reqBody:', reqBody);

    if (!reqBody.usr_id)
        return res.end("Wrong user id!");
    
     if (!reqBody.license_no)
        return res.end("Wrong license number!");

    if (!reqBody.license_end)
        return res.end("Wrong license end!");

//    var created_date = new Date(), created_date_timestamp = (new Date()).getTime();
//    var created_date = (new Date()).getTime();

    var params = {usr_id: reqBody.usr_id, license_no: reqBody.license_no,
    license_end: reqBody.license_end};
    
    var sql = "INSERT INTO tbl_ilp SET ?";

    connection.query(sql, params, function (err, rows, field) {
        if (!err) {
             res.json({code: '00', content: 'Success insert user'});
        } else {
            throw err;
        }
    });
});

//pembaharuan_lesen
app.post('/api_ilp_pembaharuan_lesen', function (req, res) {
    var reqBody = req.body;

    console.log('reqBody:', reqBody);

    if (!reqBody.usr_id)
        return res.end("Wrong user id!");
    
     if (!reqBody.license_no)
        return res.end("Wrong license number!");

    if (!reqBody.license_end)
        return res.end("Wrong license end!");

    if (!reqBody.license_start)
        return res.end("Wrong license start!");

    var params = {usr_id: reqBody.usr_id, license_no: reqBody.license_no,
    license_end: reqBody.license_end, license_start: reqBody.license_start};
    
    var sql = "INSERT INTO tbl_ilp SET ?";

    connection.query(sql, params, function (err, rows, field) {
        if (!err) {
             res.json({code: '00', content: 'Success insert user'});
        } else {
            throw err;
        }
    });
});


//tambah_cawangan
app.post('/api_ilp_tambah_cawangan', function (req, res) {
    var reqBody = req.body;

    console.log('reqBody:', reqBody);

    if (!reqBody.usr_id)
        return res.end("Wrong user id!");
    
     if (!reqBody.company_address)
        return res.end("Wrong company address!");

    if (!reqBody.company_phone)
        return res.end("Wrong company phone!");

    if (!reqBody.company_name)
        return res.end("Wrong company name!");

    if (!reqBody.company_email)
        return res.end("Wrong company eamil!");

    if (!reqBody.state_id)
        return res.end("Wrong state id!");

    var params = {usr_id: reqBody.usr_id, company_address: reqBody.company_address,
    company_phone: reqBody.company_phone, company_name: reqBody.company_name, company_email: reqBody.company_email, state_id: reqBody.state_id};
    
    var sql = "INSERT INTO tbl_ilp_application SET ?";

    connection.query(sql, params, function (err, rows, field) {
        if (!err) {
             res.json({code: '00', content: 'Success insert user'});
        } else {
            throw err;
        }
    });
});


//permohonan lesen baru bpksp
app.post('/api_bpksp_mohon_lesen_baru', function (req, res) {
    var reqBody = req.body;

    console.log('reqBody:', reqBody);

    if (!reqBody.usr_id)
        return res.end("Wrong id!");

    if (!reqBody.tobtab_tkh_lesen_mula)
        return res.end("Wrong tarikh lesen mula!");
    
     if (!reqBody.tobtab_tkh_lesen_tamat)
        return res.end("Wrong tarikh lesen tamat!");

    if (!reqBody.tobtab_no_lesen)
        return res.end("Wrong number lesen!");
    

   var created_at = new Date(), created_date_timestamp = (new Date()).getTime();

    // var created_at = (new Date()).getTime();

    var params = {usr_id: reqBody.usr_id,tobtab_tkh_lesen_mula: reqBody.tobtab_tkh_lesen_mula, tobtab_tkh_lesen_tamat: reqBody.tobtab_tkh_lesen_tamat,
    tobtab_no_lesen: reqBody.tobtab_no_lesen};
    
    var sql = "INSERT INTO tbl_tobtab SET ?";

    connection.query(sql, params, function (err, rows, field) {
        if (!err) {
             res.json({code: '00', content: 'Success insert user'});
        } else {
            throw err;
        }
    });
});
//negeri bpksp
app.get('/negeri_bpksp', function (req, res) {
    var query = req.query;
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT sta_id,sta_name FROM sys_state WHERE sta_id IN(SELECT d.sta_id FROM tbl_kp_vehicleinfo a INNER JOIN tbl_tobtab b ON a.fk_TobtabID=b.tobtab_id INNER JOIN tbl_tobtab_application c ON b.usr_id=c.usr_id INNER JOIN sys_state d ON c.sta_id=d.sta_id)";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
//papar senarai bksp mengikut negeri
app.get('/bpksp_awam_negeri', function (req, res) {
    var query = req.query;

    var sql = "SELECT a.appl_company_name,a.usr_id,b.tobtab_id,a.appl_company_address,a.district_id FROM tbl_tobtab_application a INNER join tbl_tobtab b ON a.usr_id=b.usr_id WHERE sta_id='"+query.id+"' AND a.appl_company_name IN (SELECT c.appl_company_name FROM tbl_kp_vehicleinfo a INNER JOIN tbl_tobtab b ON a.fk_TobtabID=b.tobtab_id INNER JOIN tbl_tobtab_application c ON b.usr_id=c.usr_id INNER JOIN sys_state d ON c.sta_id=d.sta_id )";

    connection.query(sql, function (err, rows, field) {//
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
app.get('/bpksp_awam_daerah', function (req, res) {
    var query = req.query;

    var sql = "SELECT a.appl_company_name,a.usr_id,a.appl_company_address,b.tobtab_id,a.district_id FROM tbl_tobtab_application a INNER join tbl_tobtab b ON a.usr_id=b.usr_id WHERE district_id='"+query.id+"' AND a.appl_company_name IN (SELECT c.appl_company_name FROM tbl_kp_vehicleinfo a INNER JOIN tbl_tobtab b ON a.fk_TobtabID=b.tobtab_id INNER JOIN tbl_tobtab_application c ON b.usr_id=c.usr_id INNER JOIN sys_state d ON c.sta_id=d.sta_id )";

    connection.query(sql, function (err, rows, field) {//
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});

//papar bpksp by tobtab id
app.get('/bpksp_awam_papar', function (req, res) {
    var query = req.query;

    var sql = "SELECT c.appl_company_name, c.usr_id, c.appl_company_address, c.appl_company_phone, a.RegistrationNumber FROM tbl_kp_vehicleinfo a INNER JOIN tbl_tobtab b ON a.fk_TobtabID=b.tobtab_id INNER JOIN tbl_tobtab_application c ON b.usr_id=c.usr_id WHERE a.fk_TobtabID='" + query.id + "'";

    connection.query(sql, function (err, rows, field) {//
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
//bpksp latest awam
app.get('/bpksp_awam', function (req, res) {
    var query = req.query;
    if(query.key){
    var sql = "SELECT a.appl_company_name,a.usr_id,b.tobtab_id,a.appl_company_address,a.district_id FROM tbl_tobtab_application a INNER join tbl_tobtab b ON a.usr_id=b.usr_id WHERE a.appl_company_name LIKE '%"+query.key+"%' AND a.appl_company_name IN (SELECT c.appl_company_name FROM tbl_kp_vehicleinfo a INNER JOIN tbl_tobtab b ON a.fk_TobtabID=b.tobtab_id INNER JOIN tbl_tobtab_application c ON b.usr_id=c.usr_id INNER JOIN sys_state d ON c.sta_id=d.sta_id )";
    }
    else{
        var sql = "SELECT appl_company_name FROM tbl_tobtab_application WHERE appl_company_name IN (SELECT c.appl_company_name FROM tbl_kp_vehicleinfo a INNER JOIN tbl_tobtab b ON a.fk_TobtabID=b.tobtab_id INNER JOIN tbl_tobtab_application c ON b.usr_id=c.usr_id )";
    }
    connection.query(sql, function (err, rows, field) {//
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});

//papar pemegang lesen bpksp tobtab dengan user_id
app.get('/user_bpksp', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM tbl_tobtab WHERE usr_id = '" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar pemegang lesen bpksp awam
app.get('/api_bpksp_orang_awam', function (req, res) {
    var query = req.query;

    var sql = "SELECT usr_fullname,usr_id FROM sys_user WHERE usr_fullname='"+query.usr_fullname+"'";
    //var sql = "SELECT usr_fullname,usr_id FROM sys_user ";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});
app.get('/negeri', function (req, res) {
    var query = req.query;
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT sta_name,sta_id FROM sys_state";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
app.get('/daerah', function (req, res) {
    var query = req.query;
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT * FROM sys_district";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});

//papar agensi pelancongan 
app.get('/tobtab_awam_carian', function (req, res) {
    var query = req.query;
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT appl_company_name,usr_id,appl_company_address FROM tbl_tobtab_application";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
app.get('/tobtab_awam_negeri', function (req, res) {
    var query = req.query;
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT a.usr_id,a.appl_company_name,appl_company_address FROM tbl_tobtab_application a INNER JOIN sys_state b ON a.sta_id=b.sta_id WHERE a.sta_id='" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
app.get('/tobtab_awam_daerah', function (req, res) {
    var query = req.query;
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT a.usr_id,a.appl_company_name,appl_company_address FROM tbl_tobtab_application a INNER JOIN sys_district b ON a.district_id=b.district_id WHERE a.district_id='" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
app.get('/tobtab_awam_carian2', function (req, res) {
    var query = req.query;

    //var sql = "SELECT appl_nama_penuh FROM tbl_tg_application";
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT usr_id,appl_company_name,appl_company_address FROM tbl_tobtab_application where appl_company_name like '%" + query.key + "%'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});

//papar detail lepas klik agensi untuk awam
app.get('/tobtab_awam_papar', function (req, res) {
    var query = req.query;
    
    //untuk demo
    var sql = "SELECT a.usr_id,a.tobtab_id,a.tobtab_no_lesen,DATE_FORMAT(a.tobtab_tkh_lesen_tamat,'%d-%m-%Y')tobtab_tkh_lesen_tamat,b.appl_company_name,b.appl_company_address,b.appl_company_phone FROM tbl_tobtab a INNER JOIN tbl_tobtab_application b ON a.usr_id=b.usr_id WHERE a.usr_id='" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
//cawangan tobtab
app.get('/tobtab_cawangan', function (req, res) {
    var query = req.query;
    
    //untuk demo
    var sql = "SELECT b.branch_address,c.sta_name,b.branch_phone,b.branch_fax FROM tbl_tobtab a INNER JOIN tbl_tobtab_branch b ON a.tobtab_id=b.tobtab_id INNER JOIN sys_state c ON b.sta_id=c.sta_id WHERE a.usr_id='"+query.id+"'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});

//papar detail untuk mohon lesen baru
app.get('/tobtab_mohon_lesen_baru', function (req, res) {
    var query = req.query;
    
    //untuk demo
    var sql = "SELECT a.usr_id,DATE_FORMAT(a.tobtab_tkh_lesen_mula,'%d-%m-%Y')tobtab_tkh_lesen_mula,b.appl_company_name,c.tobtab_application_status_name FROM tbl_tobtab a INNER JOIN tbl_tobtab_application b ON a.usr_id=b.usr_id INNER JOIN tbl_tobtab_application_status c ON c.tobtab_application_status_id=b.appl_status_id WHERE a.usr_id='68568-A'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar detail untuk renew lesen
app.get('/tobtab_renew_lesen', function (req, res) {
    var query = req.query;
    
    //untuk demo
    var sql = "SELECT a.usr_id,DATE_FORMAT(a.tobtab_tkh_lesen_mula,'%d-%m-%Y')tobtab_tkh_lesen_mula,b.appl_company_name,c.tobtab_application_status_name FROM tbl_tobtab a INNER JOIN tbl_tobtab_application b ON a.usr_id=b.usr_id INNER JOIN tbl_tobtab_application_status c ON c.tobtab_application_status_id=b.appl_status_id WHERE a.usr_id='68568-A'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar detail tukar status
app.get('/tobtab_tukar_status', function (req, res) {
    var query = req.query;
    
    //untuk demo
    var sql = "SELECT a.usr_id,DATE_FORMAT(a.tobtab_tkh_lesen_mula,'%d-%m-%Y')tobtab_tkh_lesen_mula,b.appl_company_name,c.tobtab_application_status_name FROM tbl_tobtab a INNER JOIN tbl_tobtab_application b ON a.usr_id=b.usr_id INNER JOIN tbl_tobtab_application_status c ON c.tobtab_application_status_id=b.appl_status_id WHERE a.usr_id='126941-P'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar detail tambah bidang
app.get('/tobtab_tambah_bidang', function (req, res) {
    var query = req.query;
    
    //untuk demo
    var sql = "SELECT a.usr_id,DATE_FORMAT(a.tobtab_tkh_lesen_mula,'%d-%m-%Y')tobtab_tkh_lesen_mula,b.appl_company_name,c.tobtab_application_status_name FROM tbl_tobtab a INNER JOIN tbl_tobtab_application b ON a.usr_id=b.usr_id INNER JOIN tbl_tobtab_application_status c ON c.tobtab_application_status_id=b.appl_status_id WHERE a.usr_id='35873-U'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar kpk agensi pelancongan 
app.get('/tobtab_kpk_carian', function (req, res) {
    var query = req.query;
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT appl_company_name FROM tbl_tobtab_application where usr_id='68568-A' ";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar detail untuk tobtab kpk
app.get('/tobtab_kpk_papar', function (req, res) {
    var query = req.query;
    
    //untuk demo
    var sql = "SELECT a.usr_id,a.tobtab_no_lesen,DATE_FORMAT(a.tobtab_tkh_lesen_tamat,'%d-%m-%Y')tobtab_tkh_lesen_tamat,b.appl_company_name,b.appl_company_address,b.appl_company_phone,c.tobtab_application_status_name,d.tobtab_type_name FROM tbl_tobtab a INNER JOIN tbl_tobtab_application b ON a.usr_id=b.usr_id INNER JOIN tbl_tobtab_application_status c ON b.appl_status_id=c.tobtab_application_status_id INNER JOIN sys_tobtab_type d ON b.tobtab_type_id=d.tobtab_type_id WHERE a.usr_id='68568-A'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar tg by nama
app.get('/pemandu_pelancong', function (req, res) {
    var query = req.query;

    //var sql = "SELECT appl_nama_penuh FROM tbl_tg_application";
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT pers_tg_name,pers_tg_id,pers_tg_address FROM sys_persatuan_tg";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});
app.get('/pemandu_pelancong_cari', function (req, res) {
    var query = req.query;

    //var sql = "SELECT appl_nama_penuh FROM tbl_tg_application";
    
    //yang bawah hanya untuk papar satu,yang atas semua
    var sql = "SELECT pers_tg_name,pers_tg_id,pers_tg_address FROM sys_persatuan_tg where pers_tg_name like '%" + query.key + "%'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});

//papar tg selepas click pilih
app.get('/pemandu_pelancong_dua', function (req, res) {
    var query = req.query;

    //var sql = "SELECT appl_nama_penuh FROM tbl_tg_application ";
    
    //yang bawah untuk papar satu je,atas semua
    var sql = "SELECT pers_tg_name,pers_tg_address FROM sys_persatuan_tg where pers_tg_id='" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json(rows);
        } else {
            throw err;
        }
    });
});


//papar tg details
app.get('/pemandu_pelancong_detail', function (req, res) {
    var query = req.query;

    //untuk semua
    //var sql = "SELECT appl_nama_penuh,appl_kp_passport FROM tbl_tg_application";
    
    //untuk demo
    var sql = "SELECT appl_nama_penuh,appl_kp_passport FROM tbl_tg_application WHERE appl_id='10028'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar permohonan lesen baru tg
app.get('/permohonan_lesen_baru_tg', function (req, res) {
    var query = req.query;

    //var sql = "SELECT appl_nama_penuh,appl_kp_passport FROM tbl_tg_application";
    //var sql = "SELECT * FROM tbl_tg_application WHERE appl_id='"+query.appl_id+"'AND tg_type_id='"+query.tg_type_id+"'AND appl_tkh_lesen_tamat='"+query.appl_tkh_lesen_tamat+"'AND appl_tkh_lesen_keluar='"+query.appl_tkh_lesen_keluar+"'AND status_id='"+query.status_id+"'";
    
    //contoh saje, atas betul
    var sql = "SELECT a.appl_id,a.appl_warna_kp,DATE_FORMAT(a.appl_tkh_lesen_tamat,'%d-%m-%Y')appl_tkh_lesen_tamat,DATE_FORMAT(a.appl_tkh_lesen_keluar,'%d-%m-%Y')appl_tkh_lesen_keluar,b.tg_type_name,DATE_FORMAT(c.PaymentDate,'%d-%m-%Y')PaymentDate,d.appl_status_name,e.ModName FROM tbl_tg_application a INNER JOIN sys_tg_type b ON a.tg_type_id=b.tg_type_id INNER JOIN tbl_payment c ON a.appl_id=c.ApplID INNER JOIN tbl_tg_application_status d ON a.status_id=d.appl_status_id INNER JOIN tbl_modulelist e ON c.ModID=e.ModID WHERE appl_id='10028'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar detail tg untuk kpk
app.get('/tg_detail_kpk', function (req, res) {
    var query = req.query;

    //contoh saje, atas betul
    var sql = "SELECT appl_nama_penuh,appl_kp_passport,appl_id,appl_pekerjaan,appl_alamat_rumah,appl_poskod,appl_majikan_alamat,DATE_FORMAT(appl_tkh_lesen_tamat,'%d-%m-%Y')appl_tkh_lesen_tamat FROM tbl_tg_application WHERE appl_id='10028'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar carian untuk kpk
app.get('/tg_kpk_carian', function (req, res) {
    var query = req.query;

    //contoh saje, atas betul
    var sql = "SELECT appl_nama_penuh FROM tbl_tg_application WHERE appl_id='10028'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//papar tg by id
app.get('/api_pemandu_pelancong_by_id', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM tbl_tg WHERE usr_id='"+query.usr_id+"'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//select user login
app.post('/Login', function (req, res) {
    var query = req.query;
console.log(query);
    // var sql = "SELECT * FROM sys_user WHERE usr_id = '" + query.id + "' and usr_identno = '" + query.usr_identno + "'";
     var sql = "SELECT * FROM sys_user WHERE usr_id = '" + query.username + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: rows});
        } else {
            throw err;
        }
    });
});


//user signup
app.post('/user_signup', function (req, res) {
    var reqBody = req.body;

    console.log('reqBody:', reqBody);

    if (!reqBody.usr_id)
        return res.end("Wrong id!");

    if (!reqBody.usr_fullname)
        return res.end("Wrong fullname!");
    
     if (!reqBody.usr_identno)
        return res.end("Wrong Identification number!");

    if (!reqBody.usr_password)
        return res.end("Wrong password!");

    if (!reqBody.usr_email)
        return res.end("Wrong email!");
    
     // if (!reqBody.usr_bday)
     //    return res.end("Wrong user birthday");
    
     // if (!reqBody.usr_lastlogin)
     //    return res.end("Wrong last login!");
    
     // if (!reqBody.level_id)
     //    return res.end("Wrong level id!");
    
     // if (!reqBody.usr_active)
     //    return res.end("Wrong status!");
    
     // if (!reqBody.role_id)
     //    return res.end("Wrong role id!");
    
     // if (!reqBody.type_id)
     //    return res.end("Wrong type id!");
    

   var created_at = new Date(), created_date_timestamp = (new Date()).getTime();

    // var created_at = (new Date()).getTime();

    var params = {usr_id: reqBody.usr_id,usr_fullname: reqBody.usr_fullname, usr_identno: reqBody.usr_identno,
    usr_password: reqBody.usr_password, usr_email: reqBody.usr_email, created_at: created_at};
    
    var sql = "INSERT INTO sys_user SET ?";

    connection.query(sql, params, function (err, rows, field) {
        if (!err) {
             res.json({code: '00', content: 'Success insert user'});
        } else {
            throw err;
        }
    });
});


app.post('/update', function (req, res) {
    var reqBody = req.body;

    if (!reqBody.id)
        return res.end("Wrong id!");

    if (!reqBody.usr_fullname)
        return res.end("Wrong fullname!");
    
     if (!reqBody.usr_identno)
        return res.end("Wrong Identification number!");

    if (!reqBody.usr_password)
        return res.end("Wrong password!");

    if (!reqBody.usr_email)
        return res.end("Wrong email!");
    
     if (!reqBody.usr_bday)
        return res.end("Wrong user birthday");
    
     if (!reqBody.usr_lastlogin)
        return res.end("Wrong last login!");
    
     if (!reqBody.level_id)
        return res.end("Wrong level id!");
    
     if (!reqBody.usr_active)
        return res.end("Wrong status!");
    
     if (!reqBody.role_id)
        return res.end("Wrong role id!");
    
     if (!reqBody.type_id)
        return res.end("Wrong type id!");

//    var sql = "UPDATE users SET name= '" + reqBody.name + "', username = '" + reqBody.username + "' WHERE id = '" + reqBody.id + "'";
    var sql = "UPDATE sys_user SET fullname= '" + reqBody.usr_fullname + "', identno = '" + reqBody.usr_identno + "', password = '" + reqBody.usr_password + "', email = '" + reqBody.usr_email + "', birthday = '" + reqBody.usr_bday + "', last_login = '" + reqBody.usr_lastlogin + "', level_id = '" + reqBody.level_id + "', active_user = '" + reqBody.usr_active + "', role_id = '" + reqBody.role_id + "', type_id = '" + reqBody.type_id + "' WHERE usr_id = '" + reqBody.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
             res.json({code: '00', content: 'Success update user'});
        } else {
            throw err;
        }
    });
});


app.post('/delete', function (req, res) {
    var reqBody = req.body;

    if (!reqBody.id)
        return res.end("Wrong id!");

    var sql = "DELETE FROM sys_user WHERE usr_id = '" + reqBody.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.end("Success delete user: ", reqBody.id);
        } else {
            throw err;
        }
    });
});

console.log("Server listening on port " + PORT);
app.listen(PORT);

