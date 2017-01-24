var mongoose = require("mongoose");

// Schema setup for database
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
});

//model required for the database and creaters yelpCamp database
module.exports = mongoose.model("Campground", campgroundSchema); 