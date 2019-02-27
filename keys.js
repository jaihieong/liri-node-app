console.log("first line of keys.js");
// require("dotenv").config();

var spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

module.exports = {
    spotify: spotify 
};
// console.log(spotify);
console.log("end of keys.js");