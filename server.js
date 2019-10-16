const express=require('express');
const morgan=require('Morgan')
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const sendgrid=require("@sendgrid/mail");
const moment=require('moment');
let email=require('./app/model/email.js');
const randomEmail=require('./random.js');


var app=express();
app.use(morgan('dev'));
app.use(bodyparser.json());
app.listen(8888,()=>console.log("server is running on 8888"));
app.use(morgan('dev'));
app.use(express.static(__dirname,+'./app/public'));

mongoose.connect( 'mongodb://localhost:27017/mailData',{useNewUrlParser:true},function(err,conn) {
    if(!err){
        console.log("database connection established");
   }
   else{
       console.log("not established");
   }
});
var API_KEY1 ='SG.indTsYyaTzqWKBA8IGMl4w.'
var API_KEY2= 'AM__vHzEuD3ctwJpz7QlXSw_Uiz_SPP0FHBr9ryP7Qg';
var API_KEY= API_KEY1+API_KEY2;

var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
'_error','_lastModified' ]; 
 



app.get('/',function(req,res){
    res.sendFile(__dirname + '/view/index.html');
});

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

function sanitizeEmail(thisEmail){
    var thisTo = thisEmail.to;
    var newTo = [];

    var thisCC = thisEmail.cc;
    var newCC = [];

    var thisBCC = thisEmail.bcc;
    var newBCC = [];

    thisTo.forEach(function(item){
        if(item.email && item.email != "" && validateEmail(item.email)){
            newTo.push(item);
        }
    });
    
    thisCC.forEach(function(item){
        if(item.email && item.email != "" && validateEmail(item.email)){
            newCC.push(item);
        }
    });
    thisBCC.forEach(function(item){
        if(item.email && item.email != "" && validateEmail(item.email)){
            newBCC.push(item);
        }
    });
    thisEmail.to = newTo;
    thisEmail.cc = newCC;
    thisEmail.bcc = newBCC;
    return thisEmail;
};


/// for saving the mail in databases
function saveEmail(thisEmail){
    thisEmail.save()
    .then(function(thisEmail){
        console.log("email is saved in database");
        //console.log(thisEmail)
        return thisEmail;
    })
    .catch(function(err){
        console.log("Error in saving the email ")
        console.log(err);
        return null;
    })
}

// for sending the mail
function sendMail(thisEmail){
    sendgrid.setApiKey(API_KEY);
    sendgrid.send(thisEmail)
    .then(function(thisEmail){
        console.log("email has been sent ");
    })
    .catch(function(err){
        console.log("error in sending the mail");
        console.log(err);
        return null;
    })
} 

// for assigning the mail to thisemail object
function assigningTheMail(thisEmail1){

     //assign thisEmail to existing mail
    
     for (var property in thisEmail) {
        if (allowedProperties.indexOf(property) != -1){
            thisEmail[property] = thisEmail1[property];
        }
    }
    return thisEmail;
}

 /* api for handle the send request */ 
/*  app.post('/api/send', async function(req,res){
                             
    var thisEmail = req.body;   
    if(thisEmail){
        sendgrid.setApiKey(API_KEY); 
        thisEmail = sanitizeEmail(thisEmail);
        var existingEmail = email.findOne({ _id: thisEmail._id}, function(err,existingEmail){            
            if(!err){
                if(existingEmail){
                    if(existingEmail._sent){
                        console.log("This mail is already sent ");
                        res.json(existingEmail);
                    }else{
                        //assign thisEmail to existing mail
                        for (var property in thisEmail) {
                            if (allowedProperties.indexOf(property) != -1){
                                existingEmail[property] = thisEmail[property];
                            }
                        }
                        // now save the updated existing email in database
                        existingEmail._lastModified=moment().toDate();  
                       //  saveAndSendMail(existingEmail)      
                        existingEmail.save()
                        .then(function(existingEmail){
                           res.json(existingEmail);
                            console.log("existing email saved with upadated mail in database")
                        })
                        // send the Email now
                        // assign existingmail to new variable so can use in after sent for assign the sent date
                        var withSentDate = existingEmail;
                        sendgrid.send(existingEmail)
                       .then(function(existingEmail){
                        console.log(" updateded Email has been sent ");  
                        // console.log(existingEmail);  
                        // now save the email with _sent time                         
                        withSentDate._sent =  moment().toDate();   
                        // save with _sent date
                         withSentDate.save()
                        .then( function(withSentDate){
                            console.log(withSentDate);
                            res.json(withSentDate);
                            console.log("this email is now saved in databse ")
                        })
                        .catch(function(err){
                            console.log(err);
                         })                 
                        })
                        .catch(function(err){
                        console.log(err);
                        }) 
                    }   
                }else{
                    // assign new email object to newEmail

                    // newEmail = new email({});                   
                    // for (var property in thisEmail) {
                    //     if (allowedProperties.indexOf(property) != -1) {
                    //         newEmail[property] = thisEmail[property];
                    //     }
                    // }                                         
                        //first save the email   
                    var newEmail= assigningTheMail(thisEmail);        
                     newEmail._created = moment().toDate();                                                      
                    // newEmail.save()
                    // .then( function(newEmail){
                    //         console.log(newEmail);                           
                    //         console.log("this email is now saved in databse ")
                    // })
                    // .catch(function(err){
                    //         console.log(err);
                    // })
                    afterSaveNewMail = saveEmail(newEmail);
                    console.log(afterSaveNewMail);
                    var withSentDate=afterSaveNewMail
                    //send the email now   
                    sendMail(afterSaveNewMail)
                    .then(function(mail){
                        withSentDate._sent =  moment().toDate();   
                        withSentDate.save()
                        .then(function(withSentDate){
                            console.log("Email has been updated with sent email")
                            res.json(withSentDate);
                        })
                        .catch(function(err){
                            console.log("error in saving the mail with sent date")
                            console.log(err);
                            res.json(null);
                        })
                    })
                      
                    // sendgrid.send(newEmail)
                    // .then(function(newEmail){
                    //     console.log("Email has been sent ");  
                    //     console.log(newEmail);
                    //     // now save the email with _sent time 
                    //     withSentDate._sent =  moment().toDate();   
                    //     withSentDate.save()
                    //     .then( function(withSentDate){
                    //         console.log(withSentDate);
                    //         res.json(withSentDate);
                    //         console.log("this email is now saved in databse ")
                    //     })
                    //     .catch(function(err){
                    //         console.log(err);
                    //      })                
                    // })
                    // .catch(function(err){
                    //     console.log(err);
                    // })                                     
                }
            }
           });
    }
            
}); */
  /* api for save and update email objects */
app.post('/api/save',function(req,res){
      var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid', '_error','_lastModified' ];         
      var thisEmail = req.body;
      console.log(thisEmail._id);
      var existingEmail = email.findOne({ _id:thisEmail._id},function(err,existingEmail){         
      if(!err){
        if(existingEmail && existingEmail._sent){
            //do nothing
            res.json(existingEmail);
        }else{ 
            if(existingEmail){
                
            }else{
                existingEmail = new email({});
            }
            for (var property in thisEmail) {
                if (allowedProperties.indexOf(property) != -1) {
                    existingEmail[property] = thisEmail[property];
                }
            } 
            existingEmail = assigningTheMail(thisEmail);
            existingEmail._lastModified = moment().toDate();              
            existingEmail.save()
            .then( (existingEmail) =>{
                console.log("this email is now updated/save in database")
                console.log(existingEmail);
                res.json(existingEmail);    
            })
            .catch(err =>{
                console.log(err);
                res.json(null);
            });
        }       
     }
     else{
         console.log(err);
         res.json(null);
     }
    });
});

//  api for successfully delivered mails 
 app.get('/api/sent',function(req,res){   
     // find all emails obejct if error is false means already sent    
     email.find({_sent: {$exists: true}},function(err,sentEmails){
         if(!err){
            res.json(sentEmails);
           }        
         else{
             console.log(err);
         }
     })
 })
 //  api for drafts
 app.get('/api/draft',function(req,res){ 
    // find all emails obejct if error is false means already sent     
    email.find({_sent: {$exists: false}},function(err,draftEmails){
        if(!err){
            res.json(draftEmails);
        }
        else{
            console.log(err)
        }
    })
})


function promiseFn(){
    //return "B";
    setTimeout(async function() {
        var a = "A";
        console.log("1. Value is " + a);
        return a;
  }, 5000);
  
};

async function promiseFnWrapper(){
    var a = await promiseFn();
    console.log("2. Value is " + a);
};
/* promiseFnWrapper(); */

//promiseFn();








