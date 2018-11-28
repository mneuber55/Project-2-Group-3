module.exports = function(sequelize, DataTypes) {
    var Reddit = sequelize.define("Reddit", {
      // Giving the Playlist model a name of type STRING
      reddit: DataTypes.STRING,
      reddit_post: DataTypes.STRING
    });
  
    Reddit.associate = function(models) {
      // When an Playlist is deleted, also delete any associated Songs
      Reddit.hasMany(models.Song, {
        onDelete: "cascade"
      });
    };
    return Reddit;
  };