module.exports = function(app) {
  var db = require("../models");

  // Refresh a Playlist on the page
  app.get("/api/playlists/:reddit", function(req, res) {
    console.log(req.params.reddit);
    db.Song.findAll({
      where: { reddit: "r/"+req.params.reddit }
    }).then(function(songs) {
      res.json(songs);
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