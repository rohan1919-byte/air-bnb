//JOI SERVER SIDE SCHEMA VALIDATION
const Joi = require('joi');

module.exports.listingSchema=Joi.object({ 
    listing : Joi.object({ //listing object
        title : Joi.string(), //title asla pahije schema madhe to pan required asla pahije
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0), //price chi vali negative nahi pahije min 0 pahije and tyacha pude posititve pahije value
        title : Joi.string().allow("",null), //image required nahi pan empty string and null value allow asel
    }).required() //ji listing object asel ti required asel
});