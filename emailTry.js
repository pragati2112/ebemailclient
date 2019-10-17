import { constants } from "crypto";

function  promiseChain(thisEmail){   
    sendgrid.setApiKey(API_KEY);
    return new Promise(function(resolve,reject){
    thisEmail.save()
    .then(function(thisEmail){
        console.log("email saved in database")
        return thisEmail;
    })
    .then(function(thisEmail){
        thisEmail._sent=moment().toDate();
        var withSentDate=thisEmail;        
        sendgrid.send(thisEmail)
        .then(function(thisEmail){        
            console.log("email has been sent ")  ;
                     
        })
        .catch(function(err){
            console.log("Error in sending email");
            console.log(err);
        })
         return withSentDate;
    })
    .then(function(withSentDate){        
        withSentDate.save()
        .then(function(withSentDate){
            console.log("email has been saved with sent data")
            //console.log(withSentDate);
            resolve (withSentDate);
        })
        .catch(function(err){
            console.log("Error in saving email with sent data")
            console.log(err);
            return null;           
        })
    })
    .catch(function(err){
        console.log(err);
    })
})
}

function promiseNested(thisEmail){
    let keyValue;
   API_KEY.find({_A_K:{$exists: true}},function(err,key){
       if(!err){
       keyValue=key;
       }
       else{
         console.log(err);
       }
   }) 
  sendgrid.setApiKey(keyValue); 
  thisEmail.save()
  .then(function(thisEmail){
      console.log("saved in database");
      thisEmail._sent=moment().toDate();
      var withSentDate=thisEmail;
      sendgrid.send(thisEmail)
      .then( function (thisEmail){
           console.log("email has been sent");
           withSentDate.save()
           .then(function(withSentDate){
           console.log("saved in database with sent data");
           console.log(withSentDate);
           return withSentDate;
          })
          .catch(function(err){
           console.log("Error in saving the email with sent date");
           console.log(err);
           return null;
          }) 
      })
       .catch(function(err){
       console.log("Error in sending the Email");
       console.log(err);
       return null;
      })
  })
  .catch(function(err){
  console.log("Error in saving the email");
  console.log(err);
  return null;
  })
} 

function tri(){
    sendgrid.setApiKey(API_KEY); 
    sendgrid.send({  
        from:"vipulchaursiya@gmail.com",
        to:  'rambabusahu12345@gmail.com',
        cc: "vipulchaursiya@gmail.com;",
        subject:    "NEW RESERVATION!",
        html:       "SOME TEXT OR HTvv",
    }).then(function(mail){
        console.log(mail)
    })
    .catch(function(err){
        console.log(err);
    })
    
    }
    /* tri(); */

function generateMail(){    
        var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
            '_error','_lastModified' ]; 
        var thisEmail= new email({})
        console.log(randomEmail);
        for (var property in randomEmail) {
            if (allowedProperties.indexOf(property) != -1){
                thisEmail[property] = randomEmail[property];
            }
        }
        thisEmail.save()
        .then( function(thisEmail){
            console.log(thisEmail);      
            console.log("this email is now saved in databse ")
        })
        .catch(function(err){
            console.log(err);
        }) 
}
 /* generateMail(); */

 function send_email(){
    sendgrid.setApiKey(API_KEY);
    const msg = {
        to: 'vipulchaursiya@gmail.com',
        from: 'vipulchaursiya@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        body: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sendgrid.send(msg)
    .then(function(msg){
        console.log(" in then");
        //set sent
        console.log(msg);
    })
    .catch(function(err){
        //set error
        console.log("in error");
        console.log(err);
    })
}
/* send_email(); */
        
 function saveAndSendMail(thisEmail){
    sendgrid.setApiKey(API_KEY); 
    return new promise( function(resolve,reject){
     thisEmail.save()
    .then( function(thisEmail){
        console.log(" This email is now saved in database ")
        console.log(thisEmail);
    })
    .catch( function(err){
        console.log("Error in saving the email")
        console.log(err);
       // return null;
    })
    var withSentDate = thisEmail;
    // send the email now
     sendgrid.send(thisEmail)
    .then( function (thisEmail){
       console.log("Email has been sent ")          
       withSentDate._sent =  moment().toDate();   
       // save  the email with _sent date
       withSentDate.save()
       .then( function(withSentDate){
         console.log(withSentDate);
         console.log("this email is now saved in databse ");
         resolve(withSentDate);
            
        })
       .catch(function(err){
             console.log("Error in saving the email with sent date")
             console.log(err);
             reject(null)
        })   
    })
    .catch(function(err){
        console.log("Error in sending the email")
        console.log(err);
       // return null;
    })
})
}
saveAndSendMail(thisEmail)
.then(function(thisEmail){
    console.log(thisEmail);
})
.catch(function(err){
    console.log(err);
})

/* var saveKey=new API_KEY({
    _A_K:'SG.indTsYyaTzqWKBA8IGMl4w.AM__vHzEuD3ctwJpz7QlXSw_Uiz_SPP0FHBr9ryP7Q'
})
saveKey.save()
.then(function(saveKey){
    console.log(saveKey);
})
.catch(function(err){
    console.log(err);
}) */


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
    .catch(function(thisEmail){
        console.log("error in sending the mail");
        console.log(err);
        return null;
    })
} 

// for assigning the mail to thisemail object
function assigningTheMail(thisEmail1){
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
    '_error','_lastModified' ]; 

     //assign thisEmail to existing mail
     thisEmail=new email({})
     for (var property in thisEmail) {
        if (allowedProperties.indexOf(property) != -1){
            thisEmail[property] = thisEmail1[property];
        }
    }
}


app.post('/api/send', async function(req,res){
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
                             '_error','_lastModified' ];                            
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
                    newEmail = new email({});                   
                    for (var property in thisEmail) {
                        if (allowedProperties.indexOf(property) != -1) {
                            newEmail[property] = thisEmail[property];
                        }
                    }                                         
                        //first save the email        
                    newEmail._created = moment().toDate();                                                      
                    newEmail.save()
                    .then( function(newEmail){
                            console.log(newEmail);                           
                            console.log("this email is now saved in databse ")
                    })
                    .catch(function(err){
                            console.log(err);
                    })                                                         
                    //send the email now   
                     var withSentDate=newEmail ; 
                    sendgrid.send(newEmail)
                    .then(function(newEmail){
                        console.log("Email has been sent ");  
                        console.log(newEmail);
                        // now save the email with _sent time 
                        withSentDate._sent =  moment().toDate();   
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
            }
           });
    }
            
});


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
promiseFnWrapper();



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

var API_KEY1 = 'SG.G7mNEMl8Que9eY_G0i4OUA.';
var API_KEY2 = 'kv3JWcnil0ygLr0NTztjmza3b7kQzWYGcJKcKH5JX0g';
var API_KEY = API_KEY1+API_KEY2




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
function saveAndSendMail(thisEmail){
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
    '_error','_lastModified' ];  
    sendgrid.setApiKey(API_KEY); 
    return new Promise (  function(resolve,reject){
        var newEmail=email({})
        for (var property in thisEmail) {
            if (allowedProperties.indexOf(property) != -1){
                newEmail[property] = thisEmail[property];
            }
        }
        newEmail.save()
    .then( function(thisEmail){
        console.log(" This email is now saved in database ")
        console.log(thisEmail);
    })
    .catch( function(err){
        console.log("Error in saving the email")
        console.log(err);
       // return null;
    })
    var withSentDate = thisEmail;
    // send the email now
     sendgrid.send(thisEmail)
    .then( function (thisEmail){
       console.log("Email has been sent ")          
       withSentDate._sent =  moment().toDate();   
       console.log(thisEmail);
       // save  the email with _sent date
       withSentDate.save()
       .then( function(withSentDate){
         console.log(withSentDate);
         console.log("this email is now saved in databse ");
         resolve(withSentDate);
            
       })
       .catch(function(err){
             console.log("Error in saving the email with sent date")
             console.log(err);
             reject(null)
        })   
    })
    .catch(function(err){
        console.log("Error in sending the email")
        console.log(err);
       // return null;
    })
})
}
function  promiseChain(thisEmail,existingEmail){   
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
    '_error','_lastModified' ]; 
    sendgrid.setApiKey(API_KEY);
    return new Promise(function(resolve,reject){
        console.log(thisEmail)
        //var thisEmail=newEmail;
        // var newEmail=email({})
        // for (var property in thisEmail) {
        //     if (allowedProperties.indexOf(property) != -1){
        //         newEmail[property] = thisEmail[property];
        //     }
        // }
        if(existingEmail!=null){          
        for (var property in thisEmail) {
            if (allowedProperties.indexOf(property) != -1){
                existingEmail[property] = thisEmail[property];
            }
        }
    }
        else{
            existingEmail= new email({})
            for (var property in thisEmail) {
                if (allowedProperties.indexOf(property) != -1){
                    existingEmail[property] = thisEmail[property];
                }
            }
        }
        
    existingEmail.save()
    .then(function(thisEmail){
        console.log("email saved in database")
        return thisEmail;
    })
    .then(function(thisEmail){
        thisEmail._sent=moment().toDate();
        var withSentDate=thisEmail;        
        sendgrid.send(thisEmail)
        .then(function(thisEmail){        
            console.log("email has been sent ")  ;
                     
        })
        .catch(function(err){
            console.log("Error in sending email");
            console.log(err);
        })
         return withSentDate;
    })
    .then(function(withSentDate){        
        withSentDate.save()
        .then(function(withSentDate){
            console.log("email has been saved with sent data")
            //console.log(withSentDate);
            resolve (withSentDate);
        })
        .catch(function(err){
            console.log("Error in saving email with sent data")
            console.log(err);
            reject(null) ;           
        })
    })
    .catch(function(err){
        console.log(err);
    })
})
}
 /* api for handle the send request */ 
app.post('/api/send',bodyparser.json(),function(req,res){
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
                             '_error','_lastModified' ];                            
    var thisEmail = req.body;
    sendgrid.setApiKey(API_KEY);  
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
                        // for (var property in thisEmail) {
                        //     if (allowedProperties.indexOf(property) != -1){
                        //         existingEmail[property] = thisEmail[property];
                        //     }
                        // }
                        // now save the updated existing email in database
                        console.log(existingEmail);
                        console.log("in -=-=-=-=-==-=");
                        existingEmail._lastModified=moment().toDate();  
                        promiseChain(thisEmail,existingEmail)
                        .then(function(existingEmail){
                            console.log(existingEmail);
                            res.json(existingEmail);
                        })
                        .catch(function(err){
                            console.log(err);
                        })                       
                        // existingEmail.save()
                        // .then(function(existingEmail){
                        //    res.json(existingEmail);
                        //     console.log("existing email saved with upadated mail in database")
                        // })
                        // send the Email now
                        // assign existingmail to new variable so can use in after sent for assign the sent date
                    //     var withSentDate = existingEmail;
                    //     sendgrid.send(existingEmail)
                    //    .then(function(existingEmail){
                    //     console.log(" updateded Email has been sent ");  
                    //     // console.log(existingEmail);  
                    //     // now save the email with _sent time                         
                    //     withSentDate._sent =  moment().toDate();   
                    //     // save with _sent date
                    //      withSentDate.save()
                    //     .then( function(withSentDate){
                    //         console.log(withSentDate);
                    //         res.json(withSentDate);
                    //         console.log("this email is now saved in databse ")
                    //     })
                    //     .catch(function(err){
                    //         console.log(err);
                    //      })                 
                    //     })
                    //     .catch(function(err){
                    //     console.log(err);
                    //     }) 
                     }   
                   }else{
                       //assign new email object to newEmail
                        newEmail = new email({});                   
                    //    for (var property in thisEmail) {
                    //     if (allowedProperties.indexOf(property) != -1) {
                    //         newEmail[property] = thisEmail[property];
                    //     }
                    //     }     
                        promiseChain(thisEmail)
                        .then(function(thisEmail){
                            console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                            console.log(thisEmail);
                            res.json(thisEmail);
                        })
                        .catch(function(err){
                            console.log(err);
                        })                                    
                //        // first save the email                           
                //      newEmail._created = moment().toDate();                                                      
                //     newEmail.save()
                //     .then( function(newEmail){
                //            // console.log(newEmail);                           
                //             console.log("this email is now saved in databse ")
                //     })
                //     .catch(function(err){
                //             console.log(err);
                //     })                                 
                //     //send the email now  
                //     var withSentDate=newEmail;       
                //     sendgrid.send(newEmail)
                //     .then(function(newEmail){
                //         console.log("Email has been sent ");  
                //        // console.log(newEmail);
                //         // now save the email with _sent time 
                //         withSentDate._sent =  moment().toDate();   
                //         withSentDate.save()
                //         .then( function(withSentDate){
                //             console.log(withSentDate);
                //             res.json(withSentDate);
                //             console.log("this email is now saved in databse ")
                //         })
                //         .catch(function(err){
                //             console.log(err);
                //          })                
                //     })
                //     .catch(function(err){
                //         console.log(err);
                //     })                                     
                   }
                    
            }
           });
    }
            
}); 

  /* api for save and update email objects */
app.post('/api/save',bodyparser.json(),function(req,res){
      var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid', '_error','_lastModified' ];         
      var thisEmail = req.body;
      console.log(thisEmail)
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


 return new Promise( function( resolve,reject){
    setTimeout( function() {
        var a = "A";
        //console.log("1. Value is " + a);
        resolve (a);
  }, 5000);
})
  
};

    function promiseFnWrapper(){
    var a =  promiseFn() 
    
    a.then(function(data){
        console.log("2. Value is " +data);
    })
    .catch(function(err){
        console.log(err);
    })
   
   
    
};
/*  promiseFnWrapper();  */

//promiseFn();


function getApiKey()
{
    API_KEY.findOne({_A_K:{$exists:true}},function(err,ApiKey){
        if(!err){
            console.log(ApiKey);
            return ApiKey;
        }
    })
}


function getApiKey()
{
   return new Promise( function(resolve,reject){
     API_KEY.findOne({_A_K:{$exists:true}},function(err,ApiKeyDoc){
        if(!err){           
            var ApiKey=ApiKeyDoc._A_K;
            resolve (ApiKey);
        }
        else{
            console.log(err);
        }
    })
   })
   
}



