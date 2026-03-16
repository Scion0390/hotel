const express = require("express");
const router = express.Router();
const customError = require("../customError.js");
const Review = require("../models/review.js");
const User = require("../models/abc.js");
const data = require("../models/user.js");
const {valid, reviewSchema} = require("../schema.js");
const {isLoggedIn,owner} = require("../middleware.js");
const flash = require("connect-flash");
const multer = require("multer");
const {storage, cloudinary} = require("../cloud.js");
const upload = multer({storage});

router.get("/home",async(req,res,next)=>{
    try{
        let users = await data.find({});
        res.render("home.ejs",{users,bodyClass:''});
    }catch(err){
        next(err)
    }
})

router.get("/info/:id",async (req,res,next)=>{
    try {
        let {id}= req.params;
        let users = await data.findById(id);
        let reviews = await Review.find({own:id})
        res.render("show.ejs",{users,bodyClass:'',reviews,owner});
    } catch (err) {
        next(err);
    }
});

router.get("/create",(req,res,next)=>{
    try{
        res.render("create.ejs",{bodyClass:''});
    }catch(err){
        next(err);
    }
})

router.post("/aftcreate",upload.single("img"),async(req,res,next)=>{
    try {
            let {value,error} = valid.validate(req.body)
            if(error){
                next(new customError(404,error.details[0].message))
            }
            let {title,time,price,location,info} = value;
            const imagePath = req.file.path;
            const fileName = req.file.filename;
            let user={
                title: title,
                time: time,
                price: price,
                location: location,
                info: info,
                img: {
                    url: imagePath,
                    filename: fileName,
                },
            }
            user.owner = req.user._id;
            await data.create(user);
            req.flash("created","post created successfully");
            res.redirect("/home");
        } catch (err) {
            next(err);
        }
});

router.get("/edit/:id",isLoggedIn,owner,async (req,res,next)=>{
    try {
        let{id}= req.params;
    let user= await data.findById(id);
    res.render("edit.ejs",{user, bodyClass:''});
    } catch (err) {
        next(err);
    }
});

router.put("/aftedit/:id", upload.single("img"), async (req, res, next) => {
    try {
        const { value, error } = valid.validate(req.body);
        if (error) {
            return next(new customError(400, error.details[0].message));
        }

        const { id } = req.params;
        const user = await data.findById(id);

        if (!user) {
            return next(new customError(404, "Post not found"));
        }

        const { title, time, price, location, info } = value;

        user.title = title;
        user.time = time;
        user.price = price;
        user.location = location;
        user.info = info;
        
            if (req.file) {
                user.img = {
                url: req.file.path,
                filename: req.file.filename
                };
            }
            
            await user.save();
            req.flash("edit","post edited successfully");
            res.redirect("/home");

} catch (err) {
        next(err);
    }
});


router.post("/user/:id/reviews",isLoggedIn,async(req,res,next)=>{
    let {error,value} = reviewSchema.validate(req.body);
    if(error){
        return next(new customError(400,error.details[0].message));
    }
    let user = await User.findById(req.params.id);
    let review= new Review(value);
    review.own = req.params.id;

    await review.save();

    await user.save();
    res.redirect(`/info/${req.params.id}`);
});

router.delete("/user/:id/reviews/:rid",async(req,res,next)=>{
    let {id,rid}= req.params;
    await Review.findByIdAndDelete(rid);
    res.redirect(`/info/${id}`);
})


router.get("/Post/:id",async(req,res,next)=>{
    try{
        let {id} = req.params;
        let user = await User.findById(id);
        let posts = await data.find({owner:id});
        res.render("homepost.ejs",{posts,bodyClass:''});
    }catch(err){
        next(err)
    }
})

router.get("/postinfo/:id",async (req,res,next)=>{
    try {
        let {id}= req.params;
        let users = await data.findById(id);
        let reviews = await Review.find({own:id})
        res.render("showpost.ejs",{users,bodyClass:'',reviews,owner});
    } catch (err) {
        next(err);
    }
});


router.delete("/delete/:id",async(req,res,next)=>{
    try {
        let {id} = req.params;
    await data.findByIdAndDelete(id);
    req.flash("del","post delete successfully");
    res.redirect("/Post");
    } catch (err) {
        next(err);
    }
});

module.exports = router;