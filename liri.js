console.log("first line of liri.js");
require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require("axios");
var keys = require("./keys.js");
var moment = require('moment');
var fs = require("fs");

var clInputs = process.argv;
var command = clInputs[2];
var searchInput = clInputs[3];

searchAPI(command);

function searchAPI(command){

    switch(command)
    {
        case "concert-this":
            searchConcert();
            break;
        case "spotify-this-song":
            searchSpotify();
            break;
        case "movie-this":
            searchMovie();
            break;
        case "do-what-it-says":
            runRandomText();
            break;
        default:
            console.log("Command not found. Check your command and Try again");

    }
};

function searchConcert(){
    // console.log("inside of searchConcert function");
    // console.log(command);
    // console.log(searchInput);

    // Then run a request with axios to the OMDB API with the movie specified
    axios.get("https://rest.bandsintown.com/artists/" + searchInput + "/events?app_id=codingbootcamp").then(function(response) {
        // console.log(response.data[0]);
        for (var i = 0; i < response.data.length; i++){
            console.log("\nVenue # " + i + " ********************************************");
            // * Name of the venue
            console.log("\tName of the Venue: " + response.data[i].venue.name);
            // * Venue location
            console.log("\tVenue Location: " + response.data[i].venue.city);
            // * Date of the Event (use moment to format this as "MM/DD/YYYY")
            console.log("\tDate of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
            console.log("\n//////////////////////////////////////////////////////////");
        }
    })
    .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
    });;
};

function searchSpotify(){
    // console.log("inside of searchSpotify function");
    // console.log(command);
    // console.log(searchInput);

    var spotify = new Spotify(keys.spotify);
    // console.log(spotify);
    if (searchInput === undefined){
        spotify
        .request('https://api.spotify.com/v1/albums/5UwIyIyFzkM7wKeGtRJPgB')
        
        .then(function(data) {
            // console.log(data);
            console.log("\n*****************************************************");
            console.log("\tArtist: " + data.artists[0].name); 
            console.log("\tName of the song: " + data.name);
            console.log("\tPreview Link: " + data.href);
            console.log("\n*****************************************************");

        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
    } else {

        spotify.search({ type: 'track', query: searchInput, limit: 10 }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            }
            // console.log(data);
            // console.log(data.tracks.items.length); 
            // console.log(data.tracks.items);
            // * If no song is provided then your program will default to "The Sign" by Ace of Base.
            
            displaySongInfo(data);
            
        });
    }
};

function displaySongInfo(data){
    for (var i = 0; i < data.tracks.items.length; i++){
        console.log("\n*****************************************************");
        // * Artist(s)
        console.log("\tArtists: " + data.tracks.items[i].album.artists[0].name);
        // * Name of the song
        console.log("\tName of the song: " + data.tracks.items[i].name);
        // * A preview link of the song from Spotify
        console.log("\tPreview Link: " + data.tracks.items[i].external_urls.spotify);
        // * The album that the song is from
        console.log("\tName of the Album: " + data.tracks.items[i].album.name);
        
        console.log("\n*****************************************************");
    }
};

function searchMovie(){
    // console.log("inside of searchMovie function");
    // console.log(command);
    // console.log(searchInput);
    //     * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if (searchInput === undefined){
        searchInput = "Mr. Nobody";
    }
    // Then run a request with axios to the OMDB API with the movie specified
    axios.get("http://www.omdbapi.com/?t=" + searchInput + "&y=&plot=short&apikey=trilogy").then(function(response) {
        // console.log(response.data);
         
            console.log("\n***************************************** Information on " + searchInput);
            if(searchInput === "Mr. Nobody"){
                //     * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>
                    console.log("\tIf you haven't watched \"Mr. Nobody,\" then you should: <http://www.imdb.com/title/tt0485947/>");
                //     * It's on Netflix!
                    console.log("\tIt's on Netflix!");
        
            } else {
                //     * Title of the movie.
                console.log("\tTitle: " + response.data.Title);
                //     * Year the movie came out.
                console.log("\tReleased Date: " + response.data.Year);

                for (var i = 0; i < response.data.Ratings.length; i++) {
                    if (i === 0){
                        //     * IMDB Rating of the movie.
                        console.log("\tIMDB Rating: " + response.data.Ratings[i].Value);
                    }

                    if (i === 1){
                        //     * Rotten Tomatoes Rating of the movie.
                        console.log("\tRotten Tomatoes Rating: " + response.data.Ratings[i].Value);
                    }
                }
                //     * Country where the movie was produced.
                console.log("\tProducing Country: " + response.data.Country);
                //     * Language of the movie.
                console.log("\tLanguage: " + response.data.Language);
                //     * Plot of the movie.
                console.log("\tPlot: " + response.data.Plot);
                //     * Actors in the movie.
                console.log("\tActors: " + response.data.Actors);
            }
            console.log("\n//////////////////////////////////////////////////////////");
    })
    .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
    });;
};

function runRandomText(){
    // console.log("inside of runRandomText function");
    // console.log(command);
    // console.log(searchInput);
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        
        var dataArray = data.split(",");
        command = dataArray[0];
        searchInput = dataArray[1];
        console.log(dataArray);

        searchAPI(command);
    });
};

