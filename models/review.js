const mongoose= require("mongoose");
const user = require("./user.js");

const reviewSchema= new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    own:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
});

module.exports= mongoose.model("Review",reviewSchema);

