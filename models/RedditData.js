module.exports = function(sequelize, DataTypes) {
    var RedditData = sequelize.define("RedditData", {
      reddit: DataTypes.STRING,
      reddit_post: DataTypes.STRING
    });
  
    RedditData.associate = function(models) {

      RedditData.hasOne(models.Song, {
        onDelete: "cascade"
      });
    };
    return RedditData;
  };