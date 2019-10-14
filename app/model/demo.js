var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var demoSchema=mongoose.Schema({
    subject: {type: String,required: true},
    body: {type: String, required: true},
})
module.exports = mongoose.model('demo', demoSchema); 