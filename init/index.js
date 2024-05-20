const mongoose= require ("mongoose");
const initData=require("./data.js");
const Listing= require("../models/listing.js")//model la require kele listing vale

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
}//mongoose chya url la variable madhe pan store karu shakt const MONGO UTL =" " as karun 

main().then(()=>{
    console.log("connected to DB")//main function la call kele 
}).catch((err)=>{
    console.log(err);
});

const initDB=async() =>{
    Listing.deleteMany({});//jo pahila data honar to sarve delete mag nantar new data add
    await Listing.insertMany(initData.data); //data key la access karayche ahe mhanun .data te data.js file madhun export kele hote na tya data object chi key la access kele
    console.log("data was initialized");
};

initDB();//initDb function la call kele
//terminal madhe cd init karun init folder madhe jaun tyanantar node index.js kara