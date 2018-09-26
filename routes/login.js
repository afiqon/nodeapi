const { connection, router } = require('../config');

router.post("/login", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  connection.query(
    "SELECT * FROM pengajar WHERE email_pengajar = ?",
    [email],
    function(error, results, fields) {
      console.log(req.body);
      if (error) {
        // console.log("error ocurred",error);
        res.send({
          code: 400,
          failed: "error ocurred"
        });
      } else {
        // console.log('The solution is: ', results);
        if (results.length > 0) {
          if (results[0].pass_pengajar == password) {
            res.send({
              code: 200,
              success: "login sucessfull",
              data: {...results[0]},
            });
          } else {
            res.send({
              code: 204,
              success: "Email and password does not match"
            });
          }
        } else {
          res.send({
            code: 204,
            success: "Email does not exits"
          });
        }
      }
    }
  );
});

module.exports = router;
