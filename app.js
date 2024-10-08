const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/Listing.js")
const path=require("path");
const methodoverride=require("method-override")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const ejsMate=require("ejs-mate");

async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to db");
});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.get("/",async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs",{allListings});
});
//login page
app.get("/listings/login",(req,res)=>{
  res.render("./listings/login.ejs");
})



app.get("/listings",async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs",{allListings});
});
//new route
 app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
 });

//show route
app.get("/listings/:id",async(req,res)=>{
   
      let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})
//create the route
app.post("/listings",async(req,res)=>{
    const newListing =new Listing(req.body.listing);
     await newListing.save();
    res.redirect("/listings");
  });
//edit route
 app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
 });
 //update route
 app.put("/listings/:id",async(req,res)=>{
    let{id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listings})
  res.redirect(`/listings/${id}`);
 });
 //delete route
 app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id)
  console.log(deletedListing);
  res.redirect("/listings");
 });


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description :"by the Beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"india",
//     });

//     await sampleListing.save();
//     console.log("sample was saved ");
//     res.send("successful testing");
// });
app.listen(8080,() =>{
  console.log("server is listening to port 8080");
});