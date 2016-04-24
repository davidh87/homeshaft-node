var Charge = function(data) {
    this.data = data;
};

Charge.prototype.data = {}

Charge.listCharges = function(offset, limit, callback) {
    console.log("Querying charges");

    var charges = [
        {
            from: "davidh",
            to: "robn",
            amount: "150",
            reason: "December gas",
            date: "1461515038"
        }
    ];
    callback(null, charges);
};

Charge.addNewCharge = function(data, callback) {
    console.log("Saving charge");
    console.log(data);
    callback(null, null);
};

module.exports  = Charge;