var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var API_KEY_schema =  mongoose.Schema({
    APIKEY:{type:String}
})
module.exports=mongoose.model('API_KEY',API_KEY_schema)