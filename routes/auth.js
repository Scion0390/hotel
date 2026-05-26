const express = require("express");
const router = express.Router();
//const abc = require("../models/abc.js");
const passport = require("passport");
const localStr = require("passport-local");
const flash = require("connect-flash");
const {generateOTP,sendEmail}= require("../email.js");
const Info= require("../models/emailschema.js");

passport.use(new localStr(Info.authenticate()));
passport.serializeUser(Info.serializeUser());
passport.deserializeUser(Info.deserializeUser());


router.get("/signup",(req,res)=>{
    res.render("signup.ejs")
});

router.post("/signup",async(req,res,next)=>{
    try {
    const { email,username ,password} = req.body
    if (!email) {
      return res.status(400).send("Email is required.");
    }

    let user = await Info.findOne({ email });

    if (!user) {
      user = new Info({ 
        email,
        username 
      });
    }
    req.session.signupData = {
      email,
      username,
      password
    };

    const otp = generateOTP();
    console.log(otp)
    user.otp = otp;
    user.otpExpire= Date.now()+5*60*1000;
    await user.save();

    await sendEmail(email, otp);

    console.log(`OTP sent to ${email}: ${otp}`);

    res.redirect("/verification");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error sending OTP.");
  }
    
});

router.get("/verification",(req,res)=>{
    res.render("verify.ejs");
})

router.post("/verify",async (req,res)=>{
try {
  const { email, otp } = req.body;

  const user = await Info.findOne({ email });
  if (!user) {
        return res.status(400).send("User not found");
      }

    if (user.otp !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).send("OTP expired");
    }
    const signupData = req.session.signupData;
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.setPassword(signupData.password);
    await user.save();

    console.log("Email verified successfully");
    delete req.session.signupData
      req.login(user,(err)=>{
      if(err){
      next(err)
      }
      req.flash("signup","signup successfully");
      return res.redirect("/home")
      })

    } catch (err) {
    console.log(err);
    res.status(500).send("Verification failed");
  }
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