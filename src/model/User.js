const moongose = require("mongoose");

let User = new moongose.Schema({
    name : String,
    email : String,
    password : String
})

module.exports = User