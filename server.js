const express=require('express');
const morgan=require('morgan');
let schoolModel=require('./mongoose');
const mongoose=require('mongoose');
var app=express();
app.listen(4202,()=>console.log("server is running on 4202"));
app.use(morgan('dev'));

/* app.get('/app.js',(req,res)=>{
    console.log('I am here');
   res.sendFile(__dirname + '/index.html');
}); */
app.use(express.static(__dirname));

mongoose.connect( 'mongodb://localhost:27017/mongodb-101',{useNewUrlParser:true},function(err,conn) {
    if(!err){
        console.log("database connection establishded");
   }
   else{
       console.log("not established");
   }
});



app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

////get all school names with the district names
app.get('/api/schools',function(req,res){
    schoolModel.aggregate([
        {
            $group:{
                    _id:'$data.name-of-institution',
                    district: {$addToSet: '$data.district'}
                   }
        },
        {  
            $project :{
                      "name of school":"$_id",
                      "district":"$district",_id:0
                      }
        }, 
        ]).then(function(doc)
        {  
          res.send({ status:"true",docs:doc});      

        })
        .catch(function(err)
        {
            console.log(err);
        });
        
  });


   //list of the schools,email,postal-address and pincode according to their given district.  
app.get('/api/schools/:district',function(req,res){
    console.log(req.params.district);
    var str=req.params.district;
    if(str==str.toUpperCase())
    {
        var r=str;
    }
    else
    {
        var r= str.toUpperCase();
    }
   
    schoolModel.aggregate([
        {
          $match:{
                'data.district':r
                 }
        },
        {
         $group:{
                _id:'$data.name-of-institution',
                email:{$addToSet:'$data.email'},
                postaladdress:{$addToSet:'$data.postal-address'},
                pincode:{$addToSet:'$data.pin-code'}
            }
        },
        {
        $project :{
                "name of school":"$_id",
                "district":"$district",
                "email":"$email",
                "postaladdress":"$postaladdress",
                "pincode":"$pincode",
                _id:0
            }
        },   
    ]).then(function(doc)
    {  

     res.send({ status:"true",docs:doc});      
       
    })
    .catch(function(err)
    {
        console.log(err);
    });

 });

