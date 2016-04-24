var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : process.env.MYSQL_HOST,
    port     : process.env.MYSQL_PORT || 3306,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE || "homeshaft"
});

var User = function() {

};


User.listUsers = function(callback) {
    console.log("Querying users");

    pool.getConnection(function(err, connection) {
        if (err) {
            callback(err, null);
        }

        connection.query("SELECT name from users", function (err, rows, fields) {
            if (err) {
                callback(err, null);
            }

            console.log("Query returned");

            var users = [];
            for (var i = 0; i < rows.length; i++) {
                users.push(rows[i].name);
            }

            connection.release();
            callback(null, users);
        });
    });

};

module.exports  = User;