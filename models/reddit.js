module.exports = function(sequelize, DataTypes) {
    var Reddit = sequelize.define("Reddit", {
      // Giving the Playlist model a name of type STRING
      name: DataTypes.STRING
    });
  
    Reddit.associate = function(models) {
      // Associating Reddits with Playlists
      Reddit.hasOne(models.Playlist, {
        onDelete: "cascade"
      });
    };
  
    return Reddit;
  };
