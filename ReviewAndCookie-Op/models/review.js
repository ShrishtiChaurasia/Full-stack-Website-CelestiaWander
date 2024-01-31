const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type : String
    },
    rating: {
        type : Number,
        max : 5,
        min : 1
    },
    created_at: {
        type : String,
        default : Date.now(),
    },
});

module.exports = mongoose.model("Review",reviewSchema);