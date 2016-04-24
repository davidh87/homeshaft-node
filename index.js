var express = require('express');
var Charge = require('./lib/Charge.js');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/api/charge/totals', function(req, res) {
    Charge.totals(function(err, data) {
        res.json(data);
    })
});

app.get('/api/charge/list', function(req, res) {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);

    Charge.listCharges(offset, limit, function(err, charges) {
        console.log("Returning charges");
        //TODO ensure return format
        res.json(charges);
    });
});

app.post('/api/charge/save', function(req, res) {
    Charge.addNewCharge({
        from: req.body.from,
        to: req.body.to,
        amount: req.body.amount,
        reason: req.body.reason
    }, function(err, result) {
        console.log("Callback called");
        res.send("Saved");
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Example app listening on port !' + port);
});
