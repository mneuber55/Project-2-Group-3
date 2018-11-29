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

module.exports = function (app) {

  //Set variables
  var env = process.env.NODE_ENV || "development";
  var config = require(__dirname + "/../config/config.json")[env];
  var Spotify = require("node-spotify-api");
  var db = require("../models");
  require("dotenv").config();
  var keys = require("../keys")
  var spotify = new Spotify(keys.spotify);
  var tables = ["music", "electronicmusic", "hiphopheads", "rock", "metal"];

  // Setup MySql
  // =============================================================
  var mysql = require("mysql");

  if (config.use_env_variable) {
    var connection = mysql.createConnection(process.env[config.use_env_variable]);
  } else {
    var connection = mysql.createConnection({
      host: "localhost",
      port: 3307,
      user: "root",
      password: "password",
      database: "playlist_db"
    });
  }


  // var connection = mysql.createConnection({

  //   host: "localhost",
  //   port: 3307,
  //   user: "root",
  //   password: "password",
  //   database: "playlist_db"
  // });



  connection.connect(function (err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });

  // ---------/r/music scrape---------

  function musicParse(reddit) {
    var counter = 1;
    connection.query("TRUNCATE TABLE r" + reddit);
    connection.query("SELECT * FROM r" + reddit + "Data", function (err, res) {
      if (err) throw err;
      for (i = 0; i < res.length; i++) {

        var query = "'" + res[i].reddit_post + "'";
        var noSquareQuery = query.replace(/\s*\[.*?\]\s*/g, '');
        var noYearQuery = noSquareQuery.replace(/\(\d+\)/g, '');
        var spotifyQuery = noYearQuery.replace(" - ", " ")
        console.log(spotifyQuery);

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

            var sql = "INSERT INTO r" + reddit + " (id, song, artist, album, preview_link) VALUES " + "('" +
              counter + "', '" +  
              data.tracks.items[0].name.replace(/'/g, '').substring(0, 100) + "', '" +
              data.tracks.items[0].album.artists[0].name.replace(/'/g, '').substring(0, 100) + "', '" +
              data.tracks.items[0].album.name.replace(/'/g, '').substring(0, 100) + "', '" +
              data.tracks.items[0].external_urls.spotify.replace(/'/g, '').substring(0, 100) + "')";
            console.log(sql);
            connection.query(sql);
            counter++;
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
        subreddits: subreddits
      });
    });
  });

  // Load playlist page and pass in the playlist name to search songs for
  app.get("/playlist/r/:reddit", function (req, res) {
    musicParse(req.params.reddit);
    setTimeout(function() {connection.query("SELECT * FROM r" + req.params.reddit, function (errSql, resSql) {
      if (errSql) throw error;
      setTimeout(function() {res.render("playlists", {
        // reddit: req.params.reddit,
        songs: resSql
      })}, 1000);
    }
    )}, 1000);
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });



  // // Load playlist page and pass in the playlist name to search songs for
  // app.get("/playlist/r/:reddit", function (req, res) {
  //   console.log(req.params.reddit);
  //   connection.query("SELECT * FROM r" + req.params.reddit, function (err, res) {
  //     console.log(res);
  //   })
  // });

  // // Load playlist page and pass in the playlist name to search songs for
  // app.get("/playlist/r/:reddit", function (req, res) {
  //   console.log(req.params.reddit);
  //   musicParse(req.params.reddit);
  //   db.Song.findAll({ where: { reddit: "r/" + req.params.reddit } }).then(function (songs) {
  //     console.log(songs);
  //     res.render("playlists", {
  //       reddit: req.params.reddit,
  //       songs: songs
  //     });
  //   });
  // });


  // // Load playlist page and pass in the playlist name to search songs for
  // app.get("/playlist/r/:reddit", function (req, res) {
  //   console.log(req.params.reddit);
  //   musicParse(req.params.reddit);
  //   connection.query("SELECT * FROM r" + req.params.reddit, function (errSql, resSql) {
  //     res.render("playlists", {
  //       reddit: req.params.reddit,
  //       songs: resSql
  //     });
  //   });
  };