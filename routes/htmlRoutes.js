module.exports = function (app) {
  var db = require("../models");
  const fs = require('fs');
  var Papa = require("papaparse");

  // Read and set any environment variables with the dotenv package
  require("dotenv").config();

  // Import the `keys.js` file and store it in a variable.
  var Keys = require("../keys")
  // Spotify
  var SpotifyWebApi = require('spotify-web-api-node');
  var spotifyApi = new SpotifyWebApi(Keys.spotify);

  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      console.log('The access token is ' + data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function (err) {
      console.log('Something went wrong!', err);
    },
  );


  function getData(reddit) {
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
                  var title = data.body.tracks.items[0].name;
                  var artist = data.body.tracks.items[0].artists[0].name;
                  var album = data.body.tracks.items[0].album.name;
                  var url = data.body.tracks.items[0].external_urls.spotify;
                  //Save song record in the database, associate with a playlist
                  db.Song.create(
                    {
                      title: title,
                      artist: artist,
                      album: album,
                      url: url,
                      reddit: "r/"+reddit
                    }
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

  // Load index page
  app.get("/", function (req, res) {
    db.Reddit.findAll({}).then(function (subreddits) {
      res.render("index", {
        msg: "Create a playlist from this selection of subreddits, or enter a custom one!",
        subreddits: subreddits
      });
    });
  });


  // Load playlist page and pass in the playlist name to search songs for
  app.get("/playlist/r/:reddit", function (req, res) {
    console.log(req.params.reddit);
    getData(req.params.reddit);
    db.Song.findAll({ where: { reddit: "r/"+req.params.reddit } }).then(function (songs) {
      console.log(songs);
      res.render("playlists", {
        reddit: req.params.reddit,
        songs: songs
      });
    });
  });


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};