<<<<<<< HEAD
module.exports = function(sequelize, DataTypes) {
    var Song = sequelize.define("Songs", {
      title: DataTypes.STRING,
      artist: DataTypes.STRING
    });
    return Song;
  };
=======
module.exports = function (sequelize, DataTypes) {
  var Song = sequelize.define("Song", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    album: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Song.associate = function(models) {
    // We're saying that a Song should belong to an Playlist
    // A Song can't be created without an Playlist due to the foreign key constraint
    Song.belongsTo(models.Playlist, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Song;
};
>>>>>>> 993ed4237229bc00b4ab7a117393ded61d1468e3
