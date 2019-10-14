const express=require('express');
const morgan=require('Morgan')
let email=require('./app/model/email.js');
const mongoose=require('mongoose');
const bodyparser=require('body-parser')

var app=express();
app.listen(8888,()=>console.log("server is running on 8888"));
app.use(morgan('dev'));
app.use(express.static(__dirname));



mongoose.connect( 'mongodb://localhost:27017/mailData',{useNewUrlParser:true},function(err,conn) {
    if(!err){
        console.log("database connection establishded");
   }
   else{
       console.log("not established");
   }
});
 

app.get('/',function(req,res){
  res.sendFile(__dirname + '/view/index.html');
});


 /* api for handle the send request */ 
app.post('/api/send',bodyparser.json(),function(req,res){
    var allowedProperties = ['from','to','cc','bcc','body','_created','_error','_sent','_sendGrid',
                             '_error','_lastModified' ];                            
    var thisEmail = req.body;
      var existingEmail = email.find({ _id:thisEmail._id},function(err,existingEmail){
          if(!err){
            if(existingEmail){
                if(existingEmail._sent){
                    //res.send({status:"This email is alreay sent"})
                    console.log("This mail is already sent ");
                    res.json(existingEmail+"hey yo");
                }
                 res.json(existingEmail+"hey"); 
            }
            else{
                existingEmail = new email({});  
                for (var property in thisEmail) {
                    if (allowedProperties.indexOf(property) != -1) {
                      existingEmail[property] = thisEmail[property];
                    }
                  }               
                    //first save the email               
                    existingEmail.save()
                    .then( (mail) =>{
                        console.log(mail);
                        console.log(existingEmail);
                        console.log("this email is now saved in databse ")
                        })
                        .catch(err =>{console.log(err);
                    })
                      
                //send the email now

            }
          }
      })           
})

  /* api for save and update email objects */
app.post('/api/save',bodyparser.json(),function(req,res){
      var allowedProperties = ['from','to','cc','bcc','body','_created','_error','_sent','_sendGrid', 
                               '_error','_lastModified' ];         
      var thisEmail = req.body;
      var existingEmail = email.find({ _id:thisEmail._id},function(err,existingEmail){
      if(!err){
        if(existingEmail){
            for (var property in thisEmail) {
                // assign the upadate email to existing email
                if (allowedProperties.indexOf(property) != -1) {
                  existingEmail[property] = thisEmail[property];
                }
              }
              existingEmail._lastModified = moment().toDate();
              // upadating existing email
              existingEmail.save()
              .then( (mail) =>{
                  console.log(mail);
                  res.json(existingEmail)
                  console.log("this email is now updated in database")
                  })
                  .catch(err =>{console.log(err);
              })
        }
        else{
            thisEmail._lastModified = moment().toDate();
            //  assign  new email to existing email to  saved for later 
            for (var property in thisEmail) {
                if (allowedProperties.indexOf(property) != -1) {
                  existingEmail[property] = thisEmail[property];
                }
              }
            existingEmail.save()
            .then( (mail) =>{
                res.json(existingEmail);
                console.log(mail);
                console.log("this email is now saved for later in database")
                })
                .catch(err =>{console.log(err);
            })
        }
     }
     else{
         console.log(err);
     }
     })
})

///  api for successfully delivered mails 
 app.get('/api/sent',function(req,res){      
     email.find({_error:false},function(err,sentEmails){
         if(!err){
             res.json(sentEmails);
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
