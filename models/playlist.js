module.exports = function(sequelize, DataTypes) {
    var Playlist = sequelize.define("Playlist", {
      // Giving the Playlist model a name of type STRING
      name: DataTypes.STRING
    });
  
    Playlist.associate = function(models) {
      // Associating Playlist with Songs
      // When an Playlist is deleted, also delete any associated Songs
      Playlist.hasMany(models.Song, {
        onDelete: "cascade"
      });
      Playlist.belongsTo(models.Reddit, {
        foreignKey: {
          allowNull: false
        }
      });
    }
    return Playlist;
};