const express = require("express");
const router = express.Router();
const abc = require("../models/abc.js");
const passport = require("passport");
const localStr = require("passport-local");
const flash = require("connect-flash");

passport.use(new localStr(abc.authenticate()));
passport.serializeUser(abc.serializeUser());
passport.deserializeUser(abc.deserializeUser());


router.get("/signup",(req,res)=>{
    res.render("signup.ejs")
});

router.post("/signup",async(req,res,next)=>{
    let {username, password} = req.body;
    let user = new abc({
        username,
    })
    let newUser = await abc.register(user,password)
    req.login(newUser,(err)=>{
        if(err){
            next(err)
        }
        req.flash("signup","signup successfully");
        return res.redirect("/home")
    })
    
});

router.get("/login",(req,res)=>{
    res.render("login.ejs")
});

router.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password"
  }),
  (req, res) => {
    req.flash("login", "Login successfull");
    res.redirect("/home");
  }
);

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash("logout","logout successfully");
    res.redirect('/home');
  });
});

module.exports = router;