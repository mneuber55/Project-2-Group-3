var db = require("../models");

module.exports = function(app) {
  // Get all playlists
  app.get("/api/playlists", function(req, res) {
    db.Playlist.findAll({ 
    }).then(function(dbPlaylists) {
      res.json(dbPlaylists);
    });
  });

  // Get a playlist by name
  app.get("/api/playlists/:name", function(req, res) {
    db.Playlist.findOne({ 
      where: { name: req.params.name },
      include: [db.Song] }
    ).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });
  
  // Delete a playlist by name
  app.delete("/api/playlists/:name", function(req, res) {
    db.Playlist.destroy({
      where: { name: req.params.name },
      include: [db.Song] }
    ).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

  // Create a playlist - Front end needs to plass in value of a name input as body - {name: nameInput.val().trim()}
  app.post("/api/playlists", function(req, res) {
    db.Playlist.create(req.body).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

  // 

};