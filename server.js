const express=require('express');
const morgan=require('Morgan')
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const sendgrid=require("@sendgrid/mail");
const moment=require('moment');
let email=require('./app/model/email.js');
const randomEmail=require('./random.js');
require('dotenv').config()
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


// api for rendering index.html file
app.get('/',function(req,res){
    res.sendFile(__dirname + '/view/index.html');
});

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

 /* function for check thisEmail to,cc,bcc value */
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

/* function for save and send email  */
function  promiseChainSaveAndSendEmail(thisEmail,existingEmail){   
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
    '_error','_lastModified' ];   
    /* passing the api key in sendgrid setapikey function */     
    sendgrid.setApiKey(process.env.API_KEY);
     /* return promise after resolve :- after saved with sent date */
    return new Promise(function(resolve,reject){
         /* thisEmail from the request */
       // console.log(thisEmail)   
        if(existingEmail!=null){    
            /*  assign new email to existing email */      
         for (var property in thisEmail) {
            if (allowedProperties.indexOf(property) != -1){
                existingEmail[property] = thisEmail[property];
            }
         }
        }
        else{
            /* making  existing mail new email object and assigning thisEmail obejct */ 
            existingEmail= new email({})
            for (var property in thisEmail) {
                if (allowedProperties.indexOf(property) != -1){
                    existingEmail[property] = thisEmail[property];
                }
            }
        } 
        /*  save the newEmail/existing Email in database */       
        existingEmail.save()
        .then(function(thisEmail){
        console.log("email saved in database")
        return thisEmail;
        })
        .then(function(thisEmail){
        /*  assign sent date to thisEmail */ 
        thisEmail._sent=moment().toDate();  
           // send the email now          
           sendgrid.send(thisEmail)
           .then(function(thisEmail){        
           console.log("email has been sent ")  ;
                     
           })
           .catch(function(err){
           console.log("Error in sending email");
           console.log(err);
           })
            /* return thisEmail for next then  */
        return thisEmail;
        })
         /* now save the email with sent date in database */
        .then(function(withSentDate){        
          withSentDate.save()
          .then(function(withSentDate){
          console.log("email has been saved with sent data")
          /*  this resolve will be return with promise */  
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
      reject(null);
      })
})
}
 /* api for handle the send request */ 
app.post('/api/send',bodyparser.json(),function(req,res){  
    var thisEmail = req.body;     
    if(thisEmail){
        
         /* check thisEmail is valid and anyone from the to,cc,bcc is in thiecEmail */
        thisEmail = sanitizeEmail(thisEmail);
        var existingEmail = email.findOne({ _id: thisEmail._id}, function(err,existingEmail){            
            if(!err){
                if(existingEmail){
                    /* check existing email has sent date or not */ 
                    if(existingEmail._sent){
                        console.log("This mail is already sent ");
                        res.json(existingEmail);
                    }else{  
                        console.log(existingEmail);  
                         /* assign lasmodified date to exsting mail */            
                        existingEmail._lastModified=moment().toDate();  
                         /* it wiil upadate existingemail with new thisEmail and will save it with sent date after sending  */
                        promiseChainSaveAndSendEmail(thisEmail,existingEmail)
                        .then(function(existingEmail){
                        console.log(existingEmail);
                         /* send the response with sent date */ 
                        res.json(existingEmail);
                        })
                        .catch(function(err){
                        console.log(err);
                        })              
                     }   
                }else{  
                 promiseChainSaveAndSendEmail(thisEmail)
                 .then(function(thisEmail){                          
                 console.log(thisEmail);
                 res.json(thisEmail);
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
      console.log(thisEmail)
      var existingEmail = email.findOne({ _id:thisEmail._id},function(err,existingEmail){         
      if(!err){
        if(existingEmail && existingEmail._sent){
            /* do nothing */
            res.json(existingEmail);
        }else{ 
            if(existingEmail){
                
            }else{
                 /* make new object of email */
                existingEmail = new email({});              
            }
            /* assign thisEmail object to upadated existingEmail/ null existingEmail  */
            for (var property in thisEmail) {
                if (allowedProperties.indexOf(property) != -1) {
                    existingEmail[property] = thisEmail[property];
                }
            } 
             /* assign lasstmodified date before saving */           
            existingEmail._lastModified = moment().toDate();              
            existingEmail.save()
            .then( (existingEmail) =>{
                console.log("this email is now updated/save in database")
                console.log(existingEmail);
                /* send after saved thisEmail object in database */
                res.json(existingEmail);    
            })
            .catch(err =>{
                console.log(err);
                res.json(null);
            });
        }       
      }else{
         console.log(err);
         res.json(null);
     }
    });
});

   /* api for successfully delivered mails */ 
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
 /*  api for drafts */
 app.get('/api/draft',function(req,res){ 
     /* find all emails obejct if error is false means already sent  */    
    email.find({_sent: {$exists: false}},function(err,draftEmails){
        if(!err){
            res.json(draftEmails);
        }
        else{
            console.log(err)
        }
    })
})

//delete an email
app.delete('/api/delete/:id',function(req,res){
    thisId=req.params.id;
   console.log(thisId);
    email.remove({_id:thisId},function(err,idDoc){
        if(!err){
            console.log(idDoc);
            res.json(idDoc);
        }else{
            console.log("Error in deleting the email");
            console.log(err);
        }
    })
 });








