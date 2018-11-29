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
  refreshPlaylists: function() {
    return $.ajax({
      url: "/api"+window.location.pathname,
      type: "GET"
    });
  },
  deleteSong: function(song) {
    return $.ajax({
      url: "/api"+window.location.pathname+"/"+song,
      type: "DELETE"
    });
  }
};

// Gets new songs from the db and repopulates the list
var handleRefresh = function() {
  API.refreshPlaylists().then(function(data) {
    var $song = data.map(function(song) {
      var $a = $("<a>")
        .text(song.song+" - "+song.artist)
        .attr("href", song.preview_link);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": song.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-secondary float-right delete")
        .attr("data", song.id)
        .text("x");
      
      $li.append($button);

      $button = $("<button>")
      .addClass("btn btn-success float-right spotify")
      .attr("data", song.preview_link)
      .text("Play in Spotify");

      $li.append($button);
      return $li;
    });

    $("#song-list").empty();
    $("#song-list").append($song);

    $(".delete").on("click", function() {
      console.log($(this).attr("data"));
      handleDelete($(this).attr("data"));
    })

    $(".spotify").on("click", function() {
      console.log($(this).attr("data"));
      window.open($(this).attr("data"));
    })
  });
};

//Delete an item from the playlist and database
var handleDelete = function(id) {
  API.deleteSong(id).then(function(data) {
    console.log(id);
    console.log("song deleted");
    console.log(id);
    console.log();
    $("li[data-id="+id+"]").remove();
  });
};

$("#refresh-button").on("click", function() {
  handleRefresh();
})

});