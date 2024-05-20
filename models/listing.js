// //model manavnar schema cha and export karun deu and usee exported schema ko app.js me use karenge 

// const { mongo } = require("mongoose");

const mongoose=require ("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
     type:String,
     required:true,
    },
    description:String,
    image:{
        filename:String,   
        url:{
        type: String,
        default:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",//default logic check karnar ki image hi user karun undefined,null asli tar hi link paste karun denar
       // set:(v) => v===" " ? "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,//default image url  paste kele jar user ne tyache photo takle nahi tar te default url set honar apan jo takla ahe to hi condition client sathi set keli ahe user sathi set keli ahe user and client yekch ahe and  jab ham frontend ke sath kam kar rhe honge
    },
},
    price:Number,
    location:String,
    country:String,
});//listing schema create kela 

const  Listing = mongoose.model("Listing",listingSchema); //model banavla 

module.exports=Listing; //export karu and app.js madhe import karu


