const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const MOONGOSE_URL = "mongodb://127.0.0.1:27017/CelestiaWander_main";
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

main()
  .then(() => console.log("my website is working"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MOONGOSE_URL);
}

// const validateListing = (req,res,next) => {
//   let { error } = listingSchema.validate(req.body);

//   if(error){
//     throw new expressError(400 , error);
//   }else{
//     next();
//   }
// }

// const sampleVillas = new Celestia({
//     title: "my new villa",
//     description: "by the beach",
//     price: 1500,
//     location: "calcutta , goa",
//     country: "india",
//  });
// sampleVillas.save().then((res) => console.log("sample was saved"))
// .catch((err) => console.log(err));

app.use("/listing",listing);
app.use("/listing/:id/reviews",review);

// app.post("/listing", wrapAsync(async (req, res) => {
//   const newListing = new Celestia(req.body.listing);
//   await newListing.save();
//   res.redirect("/listing");
// }));

app.get("/", (req, res) => {
  // res.send("doing work");
  res.render("listings/smoke.ejs");
});

app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  //res.send("something went wrong");
  let { status = 404, message = "page not found" } = err;
  res.render("./listings/alert.ejs", { message });
  //res.status(status).send(message);
});

app.listen(port, (req, res) => {
  console.log(`listen port no ${port}`);
});
