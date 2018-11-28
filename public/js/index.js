$( document ).ready(function() {
  console.log( "ready!" );
  $(".title").lettering();
  console.log("hello world")
  $("#table").hide();
  $("#playlist-selector").hide();
  $( "#start" ).click(function() {
  console.log("clicked")
  $("#back").toggle("slow");
  $("#start").hide();
  $(".table").show();
  $("#playlist-selector").show("slow");
  });


// The API object contains methods for each kind of request we'll make
var API = {
  refreshPlaylists: function(reddit) {
    return $.ajax({
      url: "/api/playlists/"+reddit,
      type: "GET"
    });
  },
  deleteSong: function(id) {
    return $.ajax({
      url: "/api/song/"+id,
      type: "DELETE"
    });
  }
};

// Gets new songs from the db and repopulates the list
var handleRefresh = function(reddit) {
  console.log(reddit);
  API.refreshPlaylists(reddit).then(function(data) {
    console.log(data);

    var $song = data.map(function(song) {
    console.log($song);
      var $a = $("<a>")
        .text(song.title)
        .attr("href", "/example/" + song.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": song.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .attr("data", song.id)
        .text("ｘ");
      
      $li.append($button);

      $button = $("<button>")
      .addClass("btn btn-primary float-right favorite")
      .text("Add Favorite");

      $li.append($button);

      return $li;
      
    });

    $("#song-list").empty();
    $("#song-list").append($song);

    $(".delete").on("click", function() {
      console.log("CLICKED IT");
      console.log($(this).attr("data"));
      handleDelete($(this).attr("data"));
    })
  });
};

//Delete an item from the playlist and database
var handleDelete = function(id) {
  console.log(id);
  API.deleteSong(id).then(function(data) {
    console.log(data);
    console.log("song deleted");
    $("li[data-id="+id+"]").remove();
  });
};

$("#refresh-button").on("click", function() {
  handleRefresh($("#refresh-button").attr("data"));
})

});