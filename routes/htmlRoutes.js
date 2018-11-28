// module.exports = function (app) {
//   var db = require("../models");
//   const fs = require('fs');
//   var Papa = require("papaparse");

//   // Read and set any environment variables with the dotenv package
//   require("dotenv").config();

//   // Import the `keys.js` file and store it in a variable.
//   var Keys = require("../keys")
//   // Spotify
//   var SpotifyWebApi = require('spotify-web-api-node');
//   var spotifyApi = new SpotifyWebApi(Keys.spotify);

//   spotifyApi.clientCredentialsGrant().then(
//     function (data) {
//       console.log('The access token is ' + data.body['access_token']);
//       spotifyApi.setAccessToken(data.body['access_token']);
//     },
//     function (err) {
//       console.log('Something went wrong!', err);
//     },
//   );


//   function getData(reddit) {
//     // Reads the data in csv file
//     fs.readFile('data.csv', "utf8", (err, data) => {
//       if (err) throw err;
//       // Converts the csv data into an array of objects
//       Papa.parse(data, {
//         header: true,
//         complete: function (results) {
//           // console.log(results.data)
//           results.data.forEach(function (object) {
//             // Uses the data stored in the objects array to search the spotify api
//             spotifyApi.searchTracks('track:' + object.song_title + ' artist:' + object.artist)
//               .then(function (data) {
//                 if (data.body.tracks.items[0]) {
//                   var title = data.body.tracks.items[0].name;
//                   var artist = data.body.tracks.items[0].artists[0].name;
//                   var album = data.body.tracks.items[0].album.name;
//                   var url = data.body.tracks.items[0].external_urls.spotify;
//                   //Save song record in the database, associate with a playlist
//                   db.Song.create(
//                     {
//                       title: title,
//                       artist: artist,
//                       album: album,
//                       url: url,
//                       reddit: "r/"+reddit
//                     }
//                   );
//                 }
//               }, function (err) {
//                 console.log('Something went wrong!', err);
//               }).catch()
//           });
//         }
//       });
//     });
//   };

//   // Load index page
//   app.get("/", function (req, res) {
//     db.Reddit.findAll({}).then(function (subreddits) {
//       res.render("index", {
//         msg: "Create a playlist from this selection of subreddits, or enter a custom one!",
//         subreddits: subreddits
//       });
//     });
//   });


//   // Load playlist page and pass in the playlist name to search songs for
//   app.get("/playlist/r/:reddit", function (req, res) {
//     console.log(req.params.reddit);
//     getData(req.params.reddit);
//     db.Song.findAll({ where: { reddit: "r/"+req.params.reddit } }).then(function (songs) {
//       console.log(songs);
//       res.render("playlists", {
//         reddit: req.params.reddit,
//         songs: songs
//       });
//     });
//   });


//   // Render 404 page for any unmatched routes
//   app.get("*", function (req, res) {
//     res.render("404");
//   });
// };



module.exports = function (app) {
  var Spotify = require("node-spotify-api");

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

  function renderData(name, res) {
    db.Song.findAll({ where: { reddit: name } }).then(function (songs) {
      res.render("playlists", {
        songs: songs
      });
    });
  };

  // ---------/r/music scrape---------
  function rMusicScrape() {
    sequelize.query("TRUNCATE TABLE rMusic");
    sequelize.query("SELECT * FROM rMusicData").then(rMusicData => {

      for (i = 0; i < rMusicData.length; i++) {

        var query = "'" + rMusicData[i].reddit_post + "'";
        console.log(query);
        var noSquareQuery = query.replace(/\s*\[.*?\]\s*/g, '');
        console.log(noSquareQuery)
        var noYearQuery = noSquareQuery.replace(/\(\d+\)/g, '');
        console.log(noYearQuery);
        var spotifyQuery = noYearQuery.replace(" - ", " ")
        console.log(spotifyQuery);

        var spotify = new Spotify(keys.spotify);

        spotify.search({
          type: "track",
          query: spotifyQuery,
          limit: 1
        }, function (err, data) {
          if (err) {
            console.log("Error occurred: " + err);
            return;
          } else {
            console.log("-------------------------");
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
            console.log("-------------------------");

            var sql = "INSERT INTO rMusic (title, artist, album, url) VALUES " + "('" +
              data.tracks.items[0].name + "', '" +
              data.tracks.items[0].album.artists[0].name + "', '" +
              data.tracks.items[0].album.name + "', '" +
              data.tracks.items[0].external_urls.spotify + "')";
            console.log(sql);
            sequelize.query(sql);
          }
        });
      }
    });
  };
  // ---------------------------------------

  // ---------/r/electronicmusic scrape---------
  function rElectronicMusicScrape() {
    sequelize.query("TRUNCATE TABLE rElectronicMusic");
    sequelize.query("SELECT * FROM rElectronicMusicData").then(rElectronicMusicData => {

      for (i = 0; i < rElectronicMusicData.length; i++) {

        var query = "'" + rElectronicMusicData[i].reddit_post + "'";
        console.log(query);
        var noSquareQuery = query.replace(/\s*\[.*?\]\s*/g, '');
        console.log(noSquareQuery)
        var noYearQuery = noSquareQuery.replace(/\(\d+\)/g, '');
        console.log(noYearQuery);
        var spotifyQuery = noYearQuery.replace(" - ", " ")
        console.log(spotifyQuery);

        var spotify = new Spotify(keys.spotify);

        spotify.search({
          type: "track",
          query: spotifyQuery,
          limit: 1
        }, function (err, data) {
          if (err) {
            console.log("Error occurred: " + err);
            return;
          } else {
            console.log("-------------------------");
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
            console.log("-------------------------");

            var sql = "INSERT INTO rElectronicMusic (title, artist, album, url) VALUES " + "('" +
              data.tracks.items[0].name + "', '" +
              data.tracks.items[0].album.artists[0].name + "', '" +
              data.tracks.items[0].album.name + "', '" +
              data.tracks.items[0].external_urls.spotify + "')";
            console.log(sql);
            sequelize.query(sql);
          }
        });
      }
    });
  };
  // ---------------------------------------

  // ---------/r/hiphopheads scrape---------
  function rHipHopHeadsScrape() {
    sequelize.query("TRUNCATE TABLE rHipHopHeadsMusic");
    sequelize.query("SELECT * FROM rHipHopHeadsData").then(rHipHopHeadsData => {

      for (i = 0; i < rHipHopHeadsData.length; i++) {

        var query = "'" + rHipHopHeadsData[i].reddit_post + "'";
        console.log(query);
        var noSquareQuery = query.replace(/\s*\[.*?\]\s*/g, '');
        console.log(noSquareQuery)
        var noYearQuery = noSquareQuery.replace(/\(\d+\)/g, '');
        console.log(noYearQuery);
        var spotifyQuery = noYearQuery.replace(" - ", " ")
        console.log(spotifyQuery);

        var spotify = new Spotify(keys.spotify);

        spotify.search({
          type: "track",
          query: spotifyQuery,
          limit: 1
        }, function (err, data) {
          if (err) {
            console.log("Error occurred: " + err);
            return;
          } else {
            console.log("-------------------------");
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
            console.log("-------------------------");

            var sql = "INSERT INTO rHipHopHeads (title, artist, album, url)) VALUES " + "('" +
              data.tracks.items[0].name + "', '" +
              data.tracks.items[0].album.artists[0].name + "', '" +
              data.tracks.items[0].album.name + "', '" +
              data.tracks.items[0].external_urls.spotify + "')";
            console.log(sql);
            sequelize.query(sql);
          }
        });
      }
    });
  };
  // ---------------------------------------

  // ---------/r/rock scrape---------
  function rRockScrape() {
    sequelize.query("TRUNCATE TABLE rRock");
    sequelize.query("SELECT * FROM rRockData").then(rRockData => {

      for (i = 0; i < rRockData.length; i++) {

        var query = "'" + rRockData[i].reddit_post + "'";
        console.log(query);
        var noSquareQuery = query.replace(/\s*\[.*?\]\s*/g, '');
        console.log(noSquareQuery)
        var noYearQuery = noSquareQuery.replace(/\(\d+\)/g, '');
        console.log(noYearQuery);
        var spotifyQuery = noYearQuery.replace(" - ", " ")
        console.log(spotifyQuery);

        var spotify = new Spotify(keys.spotify);

        spotify.search({
          type: "track",
          query: spotifyQuery,
          limit: 1
        }, function (err, data) {
          if (err) {
            console.log("Error occurred: " + err);
            return;
          } else {
            console.log("-------------------------");
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
            console.log("-------------------------");

            var sql = "INSERT INTO rRock (title, artist, album, url)) VALUES " + "('" +
              data.tracks.items[0].name + "', '" +
              data.tracks.items[0].album.artists[0].name + "', '" +
              data.tracks.items[0].album.name + "', '" +
              data.tracks.items[0].external_urls.spotify + "')";
            console.log(sql);
            connection.query(sql);
          }
        });
      }
    });
  };
  // ---------------------------------------

  // ---------/r/metal scrape---------
  function rMetalScrape() {
    sequelize.query("TRUNCATE TABLE rMetal");
    sequelize.query("SELECT * FROM rMetalData").then(rMetalData => {

      for (i = 0; i < rMetalData.length; i++) {

        var query = "'" + rMetalData[i].reddit_post + "'";
        console.log(query);
        var noSquareQuery = query.replace(/\s*\[.*?\]\s*/g, '');
        console.log(noSquareQuery)
        var noYearQuery = noSquareQuery.replace(/\(\d+\)/g, '');
        console.log(noYearQuery);
        var spotifyQuery = noYearQuery.replace(" - ", " ")
        console.log(spotifyQuery);

        var spotify = new Spotify(keys.spotify);

        spotify.search({
          type: "track",
          query: spotifyQuery,
          limit: 1
        }, function (err, data) {
          if (err) {
            console.log("Error occurred: " + err);
            return;
          } else {
            console.log("-------------------------");
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
            console.log("-------------------------");

            var sql = "INSERT INTO rMetal (title, artist, album, url)) VALUES " + "('" +
              data.tracks.items[0].name + "', '" +
              data.tracks.items[0].album.artists[0].name + "', '" +
              data.tracks.items[0].album.name + "', '" +
              data.tracks.items[0].external_urls.spotify + "')";
            console.log(sql);
            sequelize.query(sql);
          }
        });
      }
    });
  };
  // ---------------------------------------



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
  app.get("/playlist/r/:name", function (req, res) {
    //kick off reddit scrape
    //for each item in scrape, send a spotify response
    getData(req.params.name, res);
    //save each spotify response song, artist, album, link in database
  });
  
  // Load playlist page and pass in the playlist name to search songs for
  app.get("/playlist/:name", function (req, res) {
    //kick off reddit scrape
    //for each item in scrape, send a spotify response
    getData(req.params.name, res);
    //save each spotify response song, artist, album, link in database
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};