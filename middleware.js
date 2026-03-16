
const isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("log","login first");
    res.redirect("/login")
}

const owner = function(req,res,next){
    if(req.user._id==req.user.owner){
        return next()
    }
    req.flash("owner","Owner Acess Only");
    res.redirect("/home")
}


module.exports = {isLoggedIn,owner};