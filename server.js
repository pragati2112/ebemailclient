const express=require('express');
const morgan=require('Morgan')
let email=require('./app/model/email.js');
let demo=require('./app/model/demo.js');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const morgan=require('morgan');
const moment=require('moment');
const sendgrid=require("@sendgrid/mail");


var app=express();
app.use(morgan('dev'));
app.use(bodyparser.json());
app.listen(8888,()=>console.log("server is running on 8888"));
app.use(morgan('dev'));
app.use(express.static(__dirname));


app.use(express.static(__dirname,+'./app/public'));

mongoose.connect( 'mongodb://localhost:27017/mailData',{useNewUrlParser:true},function(err,conn) {
    if(!err){
        console.log("database connection established");
   }
   else{
       console.log("not established");
   }
});
var API_KEY ='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';

function send_email(){
    sendgrid.setApiKey(API_KEY);
    const msg = {
        to: 'vipulchaursiya@gmail.com',
        from: 'vipulchaursiya@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sendgrid.send(msg)
    .then(function(msg){
        console.log(" in then");
        //set sent
       // console.log(msg);
    })
    .catch(function(err){
        //set error
        console.log("in error");
        console.log(err);
    })
}
/* send_email(); */
 

app.get('/',function(req,res){
  res.sendFile(__dirname + '/view/index.html');
});


 /* api for handle the send request */ 
app.post('/api/send',function(req,res){
    var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid',
                             '_error','_lastModified' ];                            
    var thisEmail = req.body; 
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
                        existingEmail._lastModified=moment.toDate();         
                        existingEmail.save()
                        .then(function(existingEmail){
                            res.send(existingEmail);
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
                           // res.json(newEmail);
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
app.post('/api/save',function(req,res){
      var allowedProperties = ['from','to','cc','bcc','text','subject','_created','_error','_sent','_sendGrid', '_error','_lastModified' ];         
      var thisEmail = req.body;
      console.log(thisEmail._id)
      var existingEmail = email.findOne({ _id:thisEmail._id},function(err,existingEmail){
          console.log(existingEmail);
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


/* const saveEmail=new email({
    from:req.body.thisEmail.from,
    to:req.body.thisEmail.to,
    cc:req.body.thisEmail.cc,
    bcc:req.body.thisEmail.bcc,
    subject:req.body.thisEmail.subject,
    body:req.body.thisEmail.body 
 }) */
/* 
 from:thisEmail.from,
 to:thisEmail.to,
 cc:thisEmail.cc,
 bcc:thisEmail.bcc,
 subject:thisEmail.subject,
 body:thisEmail.body,                    
 _created = moment().toDate() */


/*  app.post('/api/demo',bodyparser.json(),function(req,res){
    var thisDemo=req.body;    
    var  existingDemo=demo.find({_id:thisDemo._id},function(err,existingDemo){
        console.log(existingDemo);
       if(!err){
          if(existingDemo.length>0){
              console.log("found exist email");
              res.json(null)
          }else{
            console.log(thisDemo);
            demos=new demo({
                subject:thisDemo.subject  ,     
                body:thisDemo.body
            })
            demos.save()
            .then( (demos)=>{
                console.log("demo saved");
                console.log(demos)
                res.json(demos);
            })
            .catch((err )=>{
                console.log("demo not saved");
                res.json("in demo not saved")
                console.log(err);
            })
          } 
       }
       else{
           console.log(err);
       }
   
    })
  
 
}) */
