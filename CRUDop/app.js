const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const MOONGOSE_URL = "mongodb://127.0.0.1:27017/CelestiaWander_main";
const Celestia = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

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

// const sampleVillas = new Celestia({
//     title: "my new villa",
//     description: "by the beach",
//     price: 1500,
//     location: "calcutta , goa",
//     country: "india",
//  });
// sampleVillas.save().then((res) => console.log("sample was saved"))
// .catch((err) => console.log(err));

//INDEX ROUTE
app.get("/listing", async (req, res) => {
  // Celestia.find({}).then((res) => console.log(res));
  const allListing = await Celestia.find({});
  res.render("listings/all_list.ejs", { allListing });
});

  //NEW ROUTE
  app.get(
    "/listing/new",async (req, res) => {
      res.render("listings/new_form.ejs");
    });

//READ ROUTE
app.get(
  "/listing/:id",
  async (req, res) => {
    let { id } = req.params;
     const listing = await Celestia.findById(id);
    res.render("listings/read.ejs", { listing });
  });

  //Create Route
app.post("/listing", async (req, res) => {
  const newListing = new Celestia(req.body.listing);
  await newListing.save();
  res.redirect("/listing");
});

//Edit Route
app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Celestia.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Celestia.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
});

//Delete Route
app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Celestia.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listing");
});


app.get("/", (req, res) => {
 // res.send("doing work");
  res.render("listings/smoke.ejs");
});

app.listen(port, (req, res) => {
    console.log(`listen port no ${port}`);
  });