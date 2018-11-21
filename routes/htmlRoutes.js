var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Reddit.findAll({}).then(function(subreddits) {
      res.render("index", {
        msg: "List of SubReddits",
        subreddits: subreddits
      });
    });
  });

  app.get("/playlists", function(req, res) {
    db.Playlist.findAll({}).then(function(playlists) {
      res.render("playlists", {
        msg: "Created Playlists",
        playlists: playlists
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/playlist/:id", function(req, res) {
    db.Playlist.findOne({ where: { id: req.params.id } }).then(function(playlistSelection) {
      res.render("example", {
        playlist: playlistSelection
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
