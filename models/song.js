module.exports = function (sequelize, DataTypes) {
  var Song = sequelize.define("Song", {
    reddit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Song.associate = function(models) {
    Song.belongsTo(models.RedditData, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Song;
};