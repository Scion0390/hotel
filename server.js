require("dotenv").config();
const express= require("express");
const app= express();
app.set("trust proxy", 1);
const port= process.env.PORT || 3000;
const path= require("path");
const data= require("./models/user.js");
const mo= require("method-override");
const mongoose= require("mongoose");
const auth = require("./routes/auth.js");
const passport = require("passport");
const session = require("express-session");
const mongoStore = require("connect-mongo").default
const flash= require("connect-flash");
const ejsMate = require("ejs-mate");
const {valid, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js")
const page = require("./routes/page.js")
const user = require("./routes/user.js");
const DB = process.env.DB
console.log(DB)

async function main(){
    
    await mongoose.connect(DB);
    
}
main().then(()=>{
        console.log("Database Connected")
}).catch((err)=>{
        console.log(err);
});

app.use(session({
    secret:"this is the secret",
    resave:false,
    saveUninitialized:false,
    store:mongoStore.create({
        mongoUrl:DB,
        ttl:14*24*60*60,
    }),
    proxy:true,
    cookie:{
            httpOnly: true,
            secure: process.env.NODE_ENV ==="production",
            samesite: "lax",
            maxAge: 1000*60*60*24, 
        },
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")));
app.use(mo("_method"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);


app.use((req,res,next)=>{
    res.locals.currUser= req.user;
    res.locals.User= req.user;
    res.locals.created = req.flash("created")
    res.locals.signup = req.flash("signup")
    res.locals.login = req.flash("login")
    res.locals.logout = req.flash("logout")
    res.locals.edit = req.flash("edit")
    res.locals.del = req.flash("del");
    res.locals.log = req.flash("log")
    res.locals.error = req.flash("error");
    next()
})
app.use("/",page);
app.use("/",user);
app.use("/",auth);

app.use((req,res,next)=>{
    try {
        res.status(404).render("error1.ejs")
    } catch (err) {
        next(err);
    }
});

app.use((err,req,res,next)=>{
    let {status = 500,message="some error"} = err;
    res.render("error.ejs",{status,message});
    next()
});

app.listen(port,function(){
    console.log("App is Listening");
});