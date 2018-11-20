module.exports = function(sequelize, DataTypes) {
    var Song = sequelize.define("Songs", {
      title: DataTypes.STRING,
      artist: DataTypes.STRING
    });
    return Song;
  };