module.exports = function(app) {

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
  
  var db = require("../models");

  // Refresh a Playlist on the page
  app.get("/api/playlist/r/:reddit", function(req, res) {
    console.log(req.params.reddit);
    connection.query("SELECT * FROM r" + req.params.reddit, function (errSql, resSql) {
      res.json(resSql)
    });
  });
  
  // Delete a song on the page
  app.delete("/api/playlist/r/:path/:song", function(req, res) {
    console.log(req.params.path);
    console.log(req.params.song);
    connection.query("DELETE FROM r" + req.params.path + " WHERE song = " + "'"+req.params.song+"'", function (errSql, resSql) {
      if (errSql)console.log("Error: "+errSql);
      res.json(resSql)
    });
  });
};  