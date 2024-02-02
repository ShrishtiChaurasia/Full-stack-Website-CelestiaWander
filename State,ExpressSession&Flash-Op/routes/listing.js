const express = require("express");
const router = express.Router();
const Celestia = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

//INDEX ROUTE
router.get(
  "/",
  wrapAsync(async (req, res) => {
    // Celestia.find({}).then((res) => console.log(res));
    const allListing = await Celestia.find({});
    res.render("listings/all_list.ejs", { allListing });
  })
);

//NEW ROUTE
router.get(
  "/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new_form.ejs");
  })
);

//READ ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Celestia.findById(id).populate("reviews");
    if(!listing){
      req.flash("error" , "Listing data does not exist");
      res.redirect("/listing");
    }
    res.render("listings/read.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    //let listing = req.body.listing;
    const myList = new Celestia(req.body.listing);
    await myList.save();
    req.flash("success" , "Congrats! New list data added");
    res.redirect("/listing");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Celestia.findById(id);
    if(!listing){
      req.flash("error" , "Listing requested data does not exist");
      res.redirect("/listing");
    }
    req.flash("success" , "Congrats! data is edit");
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Celestia.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Congrats! Data updated");
    res.redirect(`/listing/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Celestia.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Congrats! Data is deleted");
    res.redirect("/listing");
  })
);
module.exports = router;
