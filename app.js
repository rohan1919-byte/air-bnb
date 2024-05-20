const express=require("express");
const app=express();
const mongoose=require("mongoose");
 const Listing=require("./models/listing.js"); //apan te export kele hote na Listing model la tyala require karu "../models/listing.js" models folder madhe jaun listing.js file madhe export kele hote tyala require kar
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); //npm i ejs-mate package instaall kele mag require kele
const wrapAsync=require("./utils/wrapAsync.js")//wrapAsync file la require kele custoom error handling sathi
const ExpressError=require("./utils/ExpressError.js")//ExpressError file la require kele 
const {listingSchema} =require("./schema.js"); //joi validation kele hote na to schema la require kele  {listingSchema} ha object hota mhanun tyala curly braces madhe takle

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
}//mongoose chya url la variable madhe pan store karu shakt const MONGO UTL =" " as karun 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));//id sathi request madhla data parse karnyasathi
app.use(methodOverride("_method"));//method override la npm insatll karu first require kele mag tyala app.use kele
app.engine("ejs",ejsMate);//npm i ejs-mate package la use karat ahot
app.use(express.static(path.join(__dirname,"/public"))); //public folder la access kele

main().then(()=>{
    console.log("connected to DB")//main function la call kele 
}).catch((err)=>{
    console.log(err);
})

app.get("/",(req,res)=>{
    res.send("hii i am root")
});

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:12000,
//         location:"calenguate,goa",
//         country:"india",
//     });//sampleListing la create keli

//  await sampleListing.save(); //async await kele mhanun nahitar yithe then() function pan vapru shakle aste
//  console.log("sample was saved");
//  res.send("successful testing");

// });//document ko add kar rhe he 
//localhost:8080/testListing kelyavar message show honar successful testing and db madhe te sarve data save store honar 

//INDEX ROUTE
app.get("/listings",wrapAsync(async (req,res)=>{
  const allListings= await Listing.find({});//await function la allListings variable madhe store kele
//   console.log(allListings);  
  res.render("listings/index.ejs",{allListings}); //index.ejs sathi pahile require krave lagel path la te 5 no chi line var kele ahe and views folder madhe listings navche folder asel tyat  index.ejs file banvavi lagel and 12,13 line var view engin app.set kele 
}));//async and await nahi tyachi jagevar .then function use kela asta tari challe aste


//NEW ROUTE
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
})//yat error yet ahe mhanun te /new ha varti je /listings/:id id samjat ahe te mhanun show route chya varti theu & create route khali karat ahe karan form tar banavla pan to form ja data jo aapn form madhe lihinar to create honyasathi create route khali banavla ahe 



// SHOW ROUTE
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params; //id body madhun ghenayasathi urlencoded te 14 no chi line var kele ahe tithe parse kele ahe 
   const listing= await Listing.findById(id); //ji id yenar tyala listing variable madhe store karu 
   res.render("listings/show.ejs",{listing})
}));//title var click kelyavar purn detai yenar tya id chi jyachavar click kele ahe  


//CREATE ROUTE
app.post("/listings",wrapAsync(async(req,res)=>{ //database madhe changes karu karan create karat ahe mhnun async kahi na kahi promise return karel
    // let {title,description,image,price,country,location}=req.body //ha yek tarika ahe sare ke sare variables extract karu better wat new.ejs madhe object chi key banavu sarvanna
    // let listing=req.body.listing;//te object che key value banavle tyannantar as access karu tyanna hya line la kahli instance madhe create kele ahe
  let result= listingSchema.validate(req.body); //req.body tya joi cha schema la satisfy karat ahe all condition te validate karnar
    console.log(result);
  const newListing= new Listing(req.body.listing);  //parse kele new listing la create karnar and newListing variable madhe store karu
    await newListing.save();//newListing je apan create karu form madhun te save honar
    res.redirect("/listings");//form madhe data fill jalyavar to dave save houn to listings madhe redirect karel
    
}));//wrapAsunc file la attach kele error handling sathi karan server side tun jar kahi wrong information create honar jase ki price number chi jagevar character takli tar error yenar te err kade janar sarvat khali last la error handling route create kelela ahe to something wait wrog msg yenar page var



//EDIT ROUTE
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let{id}=req.params; 
    const listing= await Listing.findById(id); 
    res.render("listings/edit.ejs",{listing}); //listing la pass keli  te edit.ejs la pass kele
})); //form serve karun denar

//UPDATE ROUTE
app.put("/listings/:id",wrapAsync(async(req,res)=>{
   if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listings") //400 means bad request karan client side tun galti jali m jithe jithe req.body.listing tithe error throw karayche custom
   }
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})//deconstruct karu id la te javascript chi object ahe tyat parameter ahe tyala deconstruct karun parameter la accesaa karu jisko ham new update value ke sath pass kar denge
    res.redirect(`/listings/${id}`); //${id} show var redirect honar
}));;


//DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params; //id la extract keli
   let deltedListing= await Listing.findByIdAndDelete(id);
   console.log(deltedListing);
   res.redirect("/listings");
})); //id ne delete honar 
//fakt ya phase madhe aapn CRUD operation perform and databse create and api la baghitle model la create kele and connection ko establish kiya and database la initialise kele

// Listing.findByIdAndDelete("6639a6142a6fe9c0b22cd8c0").then((res)=>{
//     console.log(res);
// })

// Listing.findByIdAndDelete('6639a52dcded281e2708dd34').then((res)=>{
//     console.log(res);
// })


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
}) //konti pan wrong request yenar sarve cha sarve tar page not found ch message yenar starting la sarve route check honar jar match nahi jale tar 404 statuscode and messga page not found yenar


app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err; //je error yenar te proper yenar ata error tun status code and messgae yenar page var error cha  or statuscode=500 & messgae =something went wrong he default values ahe 
    res.status(statusCode).render("error.ejs",{message}); //error cha messge la error.ejs file madhe passs kele
    res.status(statusCode).send(message);
    // res.send("something went wrong")
})//middleware error handling pahile error jar ala kahi price chi value character madhe jali create kartanna listenings tar error yenar tar te something wend wrong msg show karnar page var

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})

//je je asynchronius rout asel tyala asyncWrap ne wrap karu error handling sathi