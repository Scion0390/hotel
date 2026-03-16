const Joi = require("joi");

const valid = Joi.object({
        title:Joi.string().min(3).pattern(/[A-Za-z]+$/).required().messages({
                "string.empty": "Name is Mandatory",
                "string.min": "Name is at least of 3 Letters",
                "string.pattern.base": "Name Containes Only Letters Not Number or Special Characters",
                "any.required": "Name is Required",
        }),
        info:Joi.string().min(5).required().messages({
                "string.empty": "Information is Mandatory",
                "string.min": "Information is at least of 5 Letters",
                "any.required": "Information is Required",
        }),
        time: Joi.string().required().messages({
                "string.empty": "Time is Mandatory",
                "any.required": "Time is Required",
        }),
        price: Joi.number().required().messages({
                "number.empty": "Price is Mandatory",
                "number.min": "Price is Greater Than 0",
                "number.patern.base": "Price Contains only number Not Letters",
                "any.required": "Price is Required",
        }),
        location: Joi.string().required().messages({
                "string.empty": "Location is Mandatory",
                "any.required": "Location is Required",
        }),
});

const reviewSchema= Joi.object({
        rating:Joi.number().required(),
        comment:Joi.string().required(),
       
})

module.exports= {valid, reviewSchema};