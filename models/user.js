const mongoose= require("mongoose");
const Review = require("./review.js");
const abc = require("./abc.js");
const { urlencoded } = require("express");

const userSchema= mongoose.Schema({
    title: {
        type: String,
    },
    img: {
        url:String,
        filename:String,
    },
    info: {
        type: String,
    },
    time: {
        type: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "abc",
    }
});

const User= mongoose.model("User",userSchema);

module.exports= User;