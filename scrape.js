// ---------/r/music scrape---------
function rMusicScrape() {
    var columns = ["column1"];
    require("csv-to-array")({
        file: "csv/rMusicData.csv",
        columns: columns
    }, function (err, array) {
        console.log(err || array);
        
        var rMusicArray = array;
        console.log(rMusicArray[0].column1);

        var spotify = new Spotify(keys.spotify);

        for (i = 0; i < rMusicArray.length; i++) {

            var query = "'" + rMusicArray[i].column1 + "'";
            console.log(query);
            var noSquareQuery = query.replace(/\s*\[.*?\]\s*/g, '');
            console.log(noSquareQuery)
            var noYearQuery = noSquareQuery.replace(/\(\d+\)/g, '');
            console.log(noYearQuery);
            var spotifyQuery = noYearQuery.replace(" - ", " ")
            console.log(spotifyQuery);

            spotify.search({
                type: "track",
                query: spotifyQuery,
                limit: 1
            }, function (err, data) {
                if (err) {
                    console.log("Error occurred: " + err);
                    return;
                } else {
                    console.log("-------------------------");
                    console.log("Song: " + data.tracks.items[0].name);
                    console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
                    console.log("Album: " + data.tracks.items[0].album.name);
                    console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
                    console.log("-------------------------");
                    
                    var sql = "INSERT INTO rMusic (song, artist, album, preview_link) VALUES " + "('" + 
                        data.tracks.items[0].name + "', '" + 
                        data.tracks.items[0].album.artists[0].name + "', '" + 
                        data.tracks.items[0].album.name + "', '" + 
                        data.tracks.items[0].external_urls.spotify + "')";
                    console.log(sql);
                    connection.query(sql, function (err) {
                        if (err) {
                            console.log("Error occurred: " + err);
                            return;
                        } else {
                            console.log("1 record inserted");
                        };
                    });
                }
            });
        }
        nextScrapeElectronicMusic();
    });
};