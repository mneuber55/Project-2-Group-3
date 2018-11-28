module.exports = function(app) {

    //Set variables
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
  
  var db = require("../models");

  // Refresh a Playlist on the page
  app.get("/api/playlists/:reddit", function(req, res) {
    console.log(req.params.reddit);
    connection.query("SELECT * FROM r" + req.params.reddit, function (errSql, resSql) {
      res.json(resSql)
    });
  });
  
  // Delete a song on the page
  app.delete("/api/song/:id", function(req, res) {
    console.log(req.params.id);
    db.Song.destroy({
      where: { id: req.params.id }
    }).then(function(songs) {
      res.json(songs);
    });
  });

};  