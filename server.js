const express=require('express');
const morgan=require('Morgan')
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const sendgrid=require("@sendgrid/mail");
const moment=require('moment');
let email=require('./app/model/email.js');
const API_KEY=require('./app/model/apikey')
var app=express();
app.use(morgan('dev'));
app.use(bodyparser.json());
app.listen(8888,function(){console.log("server is running on 8888")})
app.use(morgan('dev'));
mongoose.connect( 'mongodb://localhost:27017/mailData',{useNewUrlParser:true},function(err,conn) {    
    if(!err){
        console.log("database connection established");
   }
   else{
       console.log("connection not established");
       console.log(err);
   }
});

 /* api to send  index.html file in response */ 
app.get('/',function(req,res){
    //console.log(req);
    res.sendFile(__dirname + '/view/index.html');
});

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

 /* function for check thisEmail to,cc,bcc value  */
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

/* funtion to give apikey from datbase if its exists*/
function getApiKey()
{
   return new Promise( function(resolve,reject){
     API_KEY.findOne({_A_K:{$exists:true}},function(err,ApiKeyDoc){        
        if(!err && ApiKeyDoc){           
            var ApiKey=ApiKeyDoc._A_K;
            resolve(ApiKey);
        }
        else{
            console.log("Error in getting the API KEY");
            console.log(err);
        }
    })
   })   
}

/* function for save and send email  */
function  promiseChainSaveAndSendEmail(thisEmail,existingEmail){   
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
    '_error','_lastModified' ];   

    /* passing the api key in sendgrid setapikey function */     
    sendgrid.setApiKey(process.env.API_KEY);
     /* return promise after resolve :- after saved with sent date */
    return new Promise(function(resolve,reject){ 
        /* use of promise to use apikey */             
        apiKeyFromDatabase=getApiKey();        
        apiKeyFromDatabase.then(function(apiKey){
        sendgrid.setApiKey(apiKey)   
        /* thisEmail from the request */  
        // console.log(thisEmail)   
        if(existingEmail!=null){    
            /*  assign thisemail to existing email */      
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
           .then(function(sendgridEmail){        
           console.log("email has been sent ");  
              /* now save the email with sent date in database */   
              thisEmail.save()    
             .then(function(withSentDate){
              console.log("email has been saved with sent data");
              /*this resolve will be return with promise */  
              resolve (withSentDate);
              })
              .catch(function(err){
              console.log("Error in saving email with sent data");
              console.log(err);
              reject(null) ;           
              })
           })
           .catch(function(err){
           console.log("Error in sending email");           
           console.log(err);           
           reject(null);
           })
            /* return thisEmail for next then  */
               
        })
         
      .catch(function(err){
      console.log("Error in  sent 2")
      console.log(err);
      reject(null);
      })
    })        
})
    
}
 /* api for handle the send request */ 
app.post('/api/send',function(req,res){   
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
                         //console.log(existingEmail);  
                         /* assign lasmodified date to exsting mail */            
                        existingEmail._lastModified=moment().toDate();  
                         /* it wiil upadate existingemail with new thisEmail and will save it with sent date after sending  */
                        promiseChainSaveAndSendEmail(thisEmail,existingEmail)
                        .then(function(existingEmail){
                        //console.log(existingEmail);
                         /* send the response with sent date */ 
                        res.json(existingEmail);
                        })
                        .catch(function(err){                            
                        console.log("Error in using promise for promiseChainSaveAndSendEmail function in where existingEmaiil exist");  
                        console.log(err);
                        res.json(null);
                        })              
                     }   
                }else{ 
                    //console.log(thisEmail);                 
                promiseChainSaveAndSendEmailRes= promiseChainSaveAndSendEmail(thisEmail)
                promiseChainSaveAndSendEmailRes.then(function(thisEmail){              
                res.json(thisEmail);                 
                })
                .catch(function(err){
                console.log("Error in using promise for promiseChainSaveAndSendEmail function in where existingEmaiil is null");
                console.log(err);
                res.json(null);
                })                                                                                                      
            }                   
            }
        });
    }           
}); 

  /* api for save and update email objects */
app.post('/api/save',function(req,res){
      var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid', '_error','_lastModified' ];         
      var thisEmail = req.body;
      //console.log(thisEmail)
      var existingEmail = email.findOne({ _id:thisEmail._id},function(err,existingEmail){         
      if(!err){
        if(existingEmail._sent){
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
            .then(function (existingEmail){
                console.log("this email is now updated/save in database")
                console.log(existingEmail);
                /* send after saved thisEmail object in database */
                res.json(existingEmail);    
            })
            .catch(function(err){
                console.log("Error in saving the email")
                console.log(err);
                res.json(null);
            });
        }       
      }else{
          console.log("Error in fetching the document for send api")
         console.log(err);
         res.json(null);
     }
    });
});

 /* api for successfully delivered mails */ 
 app.get('/api/sent',function(req,res){   
     // find all emails obejct if error is false means already sent    
     email.find({_sent: {$exists: true}},function(err,sentEmails){        
         if(!err && sentEmails.length>0){
            res.json(sentEmails);
           }        
         else{
             console.log("Error in sentEmails")
             console.log(err); 
             res.json(null);            
         }
     })
 })
 /*  api for drafts */
 app.get('/api/draft',function(req,res){ 
     /* find all emails obejct if error is false means already sent  */    
    email.find({_sent: {$exists: false}},function(err,draftEmails){
        if(!err && draftEmails.length>0){
            res.json(draftEmails);
        }
        else{
            console.log("Error in draftemails")
            console.log(err)
            res.json(null);
        }
    })
})

/* delete an email */
app.delete('/api/delete/:id',function(req,res){
    thisId=req.params.id;
    //console.log(thisId);
    email.remove({_id:thisId},function(err,idDoc){
        if(!err && idDoc.length>0){
            //console.log(idDoc);
            res.json(idDoc);
        }else{
            console.log("Error in deleting the email");
            console.log(err);
        }
    })
});












