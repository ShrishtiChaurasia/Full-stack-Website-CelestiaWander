const express = require("express");
const router = express.Router({ mergeParams : true });
const Celestia = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewschema } = require("../schema.js");
const {isLoggedIn , isReviewAuthor} = require("../loginmiddleware.js");
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

//Review (Post route)
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
        console.log(req.params.id);
      let listing = await Celestia.findById(req.params.id);
      let newReview = new Review(req.body.review);
 newReview.author = req.user._id;
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      console.log("new saved");
      req.flash("success" , "Congrats! New Review Added");
      res.redirect(`/listing/${listing._id}`);
    })
  );

  //Review (delete route)
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
      let { id, reviewId } = req.params;
  
      await Celestia.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success" , "Review deleted");
      res.redirect(`/listing/${id}`);
    })
  );

  module.exports = router;