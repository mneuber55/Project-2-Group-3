module.exports = function(sequelize, DataTypes) {
    var Reddit = sequelize.define("Reddit", {
      // Giving the Playlist model a name of type STRING
      reddit: DataTypes.STRING
    });
  
    return Reddit;
  };