var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
var emailSchema = mongoose.Schema({
    from: {
        email: {
            type: String,
            required:true,
            validate: [validateEmail, 'Please fill a valid email address'] 
        },
        name: {type: String},
    },
    to: [{
        email: {
            type: String,
            validate: [validateEmail, 'Please fill a valid email address'] 
        },
        name: {type: String},
    }],
    cc: [{
        email: {
            type: String,
            validate: [validateEmail, 'Please fill a valid email address'] 
        },
        name: {type: String},
    }],
    bcc: [{
        email: {
            type: String,
            validate: [validateEmail, 'Please fill a valid email address'] 
        },
        name: {type: String},
    }],
    subject: {type: String, required: true},
    body: {type: String, required: true},
    _created: {type: Date, default: Date.now},
    _sent: {type: Date},
    _lastModified: {type: Date},
    _sendGrid: Schema.Types.Mixed,
    _error: {type: Boolean}, 
});
module.exports = mongoose.model('emails', emailSchema); 
