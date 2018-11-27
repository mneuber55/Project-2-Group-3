const fs = require('fs');
var Papa = require("papaparse");

// read and set any environment variables with the dotenv package
require("dotenv").config();

// import the `keys.js` file and store it in a variable.
var Keys = require("./keys")

// Spotify
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi(Keys.spotify);

// Get an access token and 'save' it using a setter
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log('The access token is ' + data.body['access_token']);
        spotifyApi.setAccessToken(data.body['access_token']);
        getData();
    },
    function (err) {
        console.log('Something went wrong!', err);
    },
);

function getData() {
    // Reads the data in csv file
    fs.readFile('data.csv', "utf8", (err, data) => {
        if (err) throw err;
        // Converts the csv data into an array of objects
        Papa.parse(data, {
            header: true,
            complete: function (results) {
                // console.log(results.data)
                results.data.forEach(function (object) {
                    // Uses the data stored in the objects array to search the spotify api
                    spotifyApi.searchTracks('track:' + object.song_title + ' artist:' + object.artist)
                        .then(function (data) {
                            if (data.body.tracks.items[0]) {
                            console.log(
                                "\n" +
                                "Title: " + data.body.tracks.items[0].name + "\n" +
                                "Artist: " + data.body.tracks.items[0].artists[0].name + "\n" +
                                "Album: " + data.body.tracks.items[0].album.name + "\n" +
                                "External URL: " + data.body.tracks.items[0].external_urls.spotify + "\n" +
                                "Preview URL: " + data.body.tracks.items[0].preview_url + "\n" +
                                "URI: " + data.body.tracks.items[0].uri
                                );                  
                             }
                        }, function (err) {
                            console.log('Something went wrong!', err);
                        }).catch()
                });
            }
        });
    });
};