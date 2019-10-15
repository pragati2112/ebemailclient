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

var API_KEY= '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';

console.log(API_KEY);



app.get('/',function(req,res){
    res.sendFile(__dirname + '/view/index.html');
})

 /* api for handle the send request */ 
app.post('/api/send',bodyparser.json(),function(req,res){
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
                             '_error','_lastModified' ];                            
    var thisEmail = req.body; 
    //console.log(thisEmail)
    sendgrid.setApiKey(API_KEY);  
    if(thisEmail){
        var existingEmail = email.findOne({ _id: thisEmail._id},function(err,existingEmail){            
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
                        existingEmail.save()
                        .then(function(existingEmail){
                           // res.json(existingEmail);
                            console.log("existing email saved with upadated mail in database")
                        })
                        // send the Email now
                        // assign existingmail to new variable so can use in after sent for assign the sent date
                        var withSentDate = existingEmail;
                        sendgrid.send(existingEmail)
                       .then(function(existingEmail){
                        console.log(" updateded Email has been sent ");  
                        console.log(existingEmail);  
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
  /* api for save and update email objects */
app.post('/api/save',bodyparser.json(),function(req,res){
      var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid', '_error','_lastModified' ];         
      var thisEmail = req.body;
      console.log(thisEmail._id)
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
                console.log("this email is now updated in database")
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