var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : process.env.MYSQL_HOST,
    port     : process.env.MYSQL_PORT || 3306,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE || "homeshaft"
});

var Charge = function(data) {
    this.data = data;
};

Charge.prototype.data = {}

Charge.totals = function(callback) {
    console.log("Querying totals");

    pool.getConnection(function(err, connection) {
        if (err) {
            callback(err, null);
        }
        var sql = "\
            select \
                u.name as name, \
                sum(if(s.giver=u.name,s.amount,0)) - sum(if(s.receiver=u.name,s.amount,0)) as balance \
            from users u,shafts s \
            group by u.name";



        connection.query(sql, function (err, rows, fields) {
            if (err) {
                callback(err, null);
            }

            console.log("Query returned");

            var totals = [];
            for (var i = 0; i < rows.length; i++) {
                totals.push({
                    user: rows[i].name,
                    balance: rows[i].balance
                });
            }

            connection.release();
            callback(null, totals);
        });
    });
}

Charge.listCharges = function(offset, limit, callback) {
    console.log("Querying charges, limit " + limit);

    pool.getConnection(function(err, connection) {
        if (err) {
            callback(err, null);
        }

        var sql = "SELECT giver, receiver, amount, reason, unix_timestamp(timestamp) as timestamp FROM shafts order by timestamp desc limit ? offset ?";
        var inserts = [limit, offset];
        sql = mysql.format(sql, inserts);

        connection.query(sql, function (err, rows, fields) {
            if (err) {
                callback(err, null);
            }

            console.log("Query returned");

            charges = [];
            for (var i = 0; i < rows.length; i++) {
                charges.push({
                    from: rows[i].giver,
                    to: rows[i].receiver,
                    amount: rows[i].amount,
                    reason: rows[i].reason,
                    date: rows[i].timestamp
                });
            }

            connection.release();
            callback(null, charges);
        });
    });

};

Charge.addNewCharge = function(data, callback) {
    console.log("Saving charge");
    pool.getConnection(function(err, connection) {
        if (err) {
            callback(err, null);
        }

        var sql = "INSERT INTO shafts (giver, receiver, amount, reason) VALUES (?, ?, ?, ?)";
        var inserts = [data.from, data.to, data.amount, data.reason];
        sql = mysql.format(sql, inserts);


        connection.query(sql, function (err, result) {
            if (err) throw err;

            console.log(result.insertId);
            connection.release();
            callback(null, result.insertId);
        });

    });
};

module.exports  = Charge;