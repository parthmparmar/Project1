var playAudio;
var audio;
var artist_obj = [];
var id_count = -1;
var playing_id;
var error;
var songPlaying = false;
var results;
var playButton;
var entryAdded = false;
var songID = 0;


var searchType = "music";
// key for tasteDiveKey
var tasteDiveKey = "348668-qc-DV7CJIC4";
// search limit for the aip to result
var searchLimit = 9;
var resultsArray = [];
var newRow;

function renderSongDataAttributes(playButton, result) {
  var data = {
    "data-artist-id": result.artistId,
    "data-artist-name": result.artistName,
    "data-song-name": result.trackName,
    "data-song-price": result.trackPrice,
    "data-song-rating": result.trackExplicitness,
    "data-song-release-date": result.releaseDate,
    "data-song-url": result.previewUrl,
    "data-song-track-number": result.trackNumber,
    "data-song-duration": result.trackTimeMillis,
    "data-song-id": result.trackId,
    "data-album-id": result.collectionId,
    "data-album-genre": result.primaryGenreName,
    "data-album-image-url": result.artworkUrl100,
    "data-album-rating": result.contentAdvisoryRating,
    "data-album-name": result.collectionName,
    "data-album-price": result.collectionPrice
  }

  $(playButton).attr(data);
}

function getCardDisplay(artist, album, song) {
  console.log("got into get card display method");
  var cardDisplay = {
    imageURL: album.imageUrl,
    name: artist.name,
    genre: album.genre,
    songName: song.name,
    songURL: song.url
  }

  console.log({ cardDisplay });

  return cardDisplay;
}

function updateUserIfObjectDne(playButton) {
  var userProfileProps = Object.keys(globalUserProfile);
  var ids = [playButton.attr("data-artist-id"), playButton.attr("data-album-id"), playButton.attr("data-song-id")];

  userProfileProps.forEach((prop, i) => {
    globalUserProfile[prop].forEach((obj, j) => {
      if (obj.id == ids[i]) {
        console.log("shit already exists");
      }
    });
  });
}

function renderSongDisplay(result) {
  songID++;
  if (result.wrapperType != "track" || result.kind != "song") {
    return;
  }

  var songDisplayTable = $(".song-display-table");
  newRow = $("#song-display-row").clone();
  newRow.removeClass("hidden");
  newRow.attr("id", "m" + songID);
  newRow.addClass("col")
  newRow.find(".imageClickModal").attr("src", result.previewUrl);
  playButton = $(newRow.children()[2]).children()[0];

  renderSongDataAttributes(playButton, result);
  $(newRow.children()[1]).text(result.trackName);

  songDisplayTable.append(newRow);
}

function createArtist(playButton) {
  var artistId = playButton.attr("data-artist-id").toString();

  db.collection("Artists").doc(artistId).set({
    name: playButton.attr("data-artist-name")
  });
}

async function getCollectionPromise(collectionName, artistId) {
  var promise = await db.collection(collectionName).doc(artistId.toString()).get();

  return promise;
}

async function updateDBIfObjectDoesntExist(playButton) {
  entryAdded = false;
  var cases = ["Artists", "Albums", "Songs"];
  var ids = [playButton.attr("data-artist-id"), playButton.attr("data-album-id"), playButton.attr("data-song-id")];
  var promises = [];

  ids.forEach((id, i) => {
    promises.push(getCollectionPromise(cases[i], id));
  });

  promises.forEach((promise, i) => {
    promise.then(doc => {
      if (doc.exists) {
        return;
      }

      switch (i) {
        case 0:
          entryAdded = true;
          createArtist(playButton);
          createArtistSongEntry(playButton);
          createAlbum(playButton);
          createAlbumSongEntry(playButton);
          createSong(playButton);
          createUserSongEntry(globalUser, playButton);
          break;

        case 1:
          if (entryAdded) {
            break;
          } else {
            entryAdded = true;
            createArtistSongEntry(playButton);
            createAlbum(playButton);
            createAlbumSongEntry(playButton);
            createSong(playButton);
            createUserSongEntry(globalUser, playButton);
            break;
          }

        case 2:
          if (entryAdded) {
            break;
          } else {
            entryAdded = true;
            createSong(playButton);
            createUserSongEntry(playButton);
            createArtistSongEntry(globalUser, playButton);
            break;
          }

        default:
          break;
      }
    });
  });
}

function createUserSongEntry(userId, playButton) {
  db.collection("UsersSongs").add({
    userId: userId,
    songId: parseInt(playButton.attr("data-song-id"))
  });
}

function createArtistSongEntry(playButton) {
  db.collection("ArtistsSongs").add({
    artistId: parseInt(playButton.attr("data-artist-id")),
    songId: parseInt(playButton.attr("data-song-id")),
  });
}

function createAlbum(playButton) {
  var albumId = playButton.attr("data-album-id").toString();

  db.collection("Albums").doc(albumId).set({
    genre: playButton.attr("data-album-genre"),
    imageURL: playButton.attr("data-album-image-url"),
    name: playButton.attr("data-album-name"),
    price: playButton.attr("data-album-price")
  });
}

function createAlbumSongEntry(playButton) {
  db.collection("AlbumsSongs").add({
    albumId: parseInt(playButton.attr("data-album-id")),
    songId: parseInt(playButton.attr("data-song-id"))
  });
}

function createSong(playButton) {
  var trackId = $(playButton).attr("data-song-id");

  db.collection("Songs").doc(trackId).set({
    name: $(playButton).attr("data-song-name"),
    price: parseInt($(playButton).attr("data-song-price")),
    rating: $(playButton).attr("data-song-rating"),
    releaseDate: $(playButton).attr("data-song-release-date"),
    songURL: $(playButton).attr("data-song-url"),
    trackNumber: parseInt($(playButton).attr("data-song-track-number")),
    duration: parseInt($(playButton).attr("data-song-duration"))
  });

}


$(document).ready(function () {
  $(".modal").modal();
  $('.sidenav').sidenav();

  $("#userArtistInput").on("click", function (event) {
    event.preventDefault();

    if ($("#userSearch").val() == "") {
      $("#empty-alert").removeClass("off");
      $("#userSearch").effect("shake");
    }

    if ($("#userSearch").val() != "") {
      $(".errorStyle").empty();
      $("#empty-alert").addClass("off");
      $(".main-search-result-continer").find(".col").empty();
      id_count = 0;
      resultsArray = [];
      artist_obj = [];


      var searchValue = $("#userSearch").val().trim().toUpperCase();

      $(".recomendations-result-container").text("Search results for " + searchValue);

      tasteDive(searchValue, searchType, tasteDiveKey, searchLimit);
    };

    function tasteDive(value, type, key, limit) {
      queryURL = "https://tastedive.com/api/similar?q=" + value + "&type=" + type + "&k=" + key + "&limit=" + limit;
      $.ajax({
        url: queryURL,
        method: "GET",
        crossDomain: true,
        dataType: 'jsonp',
      }).then(function (results) {
        results.Similar.Results.forEach(function (item) {
          resultsArray.push(item.Name);
        });

        if (resultsArray.length == 0) {
          error = true;
          var error = $("<p>");
          error.attr("class", "errorStyle");
          error.text(searchValue + " was not found. Please try again.");
          $(".main-search-result-continer").append(error);
        }
        else {
          callItunesAPI();
        };
      });
      $("#userSearch").val('');
    }

    function callItunesAPI() {
      var artist
      for (var i = 0; i < resultsArray.length; i++) {
        var artistNameFromArray = resultsArray[i]
        var queryURL = "https://itunes.apple.com/search?term=" + artistNameFromArray + "&limit=1";
        $.ajax({
          url: queryURL,
          method: "GET",
          crossDomain: true,
          dataType: 'jsonp',
        })
          .then(function (response) {
            var result = response.results;
            artist = {
              name: result[0].artistName,
              genre: result[0].primaryGenreName,
              imageURL: result[0].artworkUrl100,
              songName: result[0].trackName,
              songURL: result[0].previewUrl
            };
            artist_obj.push(artist);
            id_count++;
            cardDisplay(id_count, artist);
          });
      };
    }
  });


  function cardDisplay(item, object_artist) {
    // create cards
    console.log("got into the render card display method");
    var masterCard = $("#card");
    var newCard = masterCard.clone(true);

    newCard.attr("id", "card" + (item));
    newCard.removeClass("off");
    newCard.find(".artist-image").attr("src", object_artist.imageURL);
    newCard.find(".artist-name").text(object_artist.name);
    newCard.find(".genre").text("Genre: " + object_artist.genre);
    newCard.find(".song").text("Track Name: " + object_artist.songName);
    newCard.find(".imageClick").attr("src", object_artist.songURL);
    $("#" + (item)).append(newCard);
    console.log({ newCard });
  }


  $(document).on("click", ".imageClick", function () {
    if (songPlaying == false) {
      if ($(this).attr("data-audio-status") != "playing") {
        console.log(playing_id)
        playAudio = $(this).attr("src");
        audio = new Audio(playAudio);
        audio.play();
        $(this).attr("data-audio-status", "playing");
        songPlaying = true;
        playing_id = $(this).closest(".col").attr("id");
      }
    }

    else if (songPlaying == true) {
      if ($(this).attr("data-audio-status") == "playing") {
        audio.pause();
        $(this).attr("data-audio-status", "paused");
        songPlaying = false;
      }
      else if ($(this).attr("data-audio-status") != "playing") {
        audio.pause();
        $("#" + playing_id).find(".imageClick").attr("data-audio-status", "paused");
        playAudio = $(this).attr("src");
        audio = new Audio(playAudio);
        audio.play();
        $(this).attr("data-audio-status", "playing");
        playing_id = $(this).closest(".col").attr("id");
      }
    }
  });

  $(document).on("click", ".imageClickModal", function () {
    if (songPlaying == false) {
      if ($(this).attr("data-audio-status") != "playing") {
        console.log(playing_id)
        playAudio = $(this).attr("src");
        audio = new Audio(playAudio);
        audio.play();
        $(this).attr("data-audio-status", "playing");
        songPlaying = true;
        playing_id = $(this).closest(".col").attr("id");
      }
    }

    else if (songPlaying == true) {
      if ($(this).attr("data-audio-status") == "playing") {
        audio.pause();
        $(this).attr("data-audio-status", "paused");
        songPlaying = false;
      }
      else if ($(this).attr("data-audio-status") != "playing") {
        audio.pause();
        $("#" + playing_id).find(".imageClickModal").attr("data-audio-status", "paused");
        playAudio = $(this).attr("src");
        audio = new Audio(playAudio);
        audio.play();
        $(this).attr("data-audio-status", "playing");
        playing_id = $(this).closest(".col").attr("id");
      }
    }
  });



  $(".modal-trigger").on("click", function () {
    var artistClickedImage = $(this).closest(".col").attr("id");
    var modalImageUrl = $("#" + artistClickedImage).find(".artist-image").attr("src");
    console.log(artistClicked);
    $("#modalArtistImage").attr("src", modalImageUrl);
    var modalArtistName = $(this).text();
    $("#modalArtistName").text(modalArtistName);
    $("#artistDescription").empty();


    var artistClicked = $(this).text();
    var audioQueryURL = "theaudiodb.com/api/v1/json/1/search.php?s=" + artistClicked;

    $.ajax({
      url: audioQueryURL,
      method: "GET",
      crossDomain: true,
      dataType: 'jsonp',
    }).then(function (response) {
      var result = response.artists;
      var artistBio = result[0].strBiographyEN;

      $("#artistDescription").append(artistBio);
    });


    var queryURL = "https://itunes.apple.com/search?term=" + $(this).text() + "&limit=25";

    var childRows = $("tbody").children();
    for (var i = 1; i < childRows.length; i++) {
      childRows[i].remove();
    }

    $.ajax({
      url: queryURL,
      method: "GET",
      crossDomain: true,
      dataType: 'jsonp',
    }).then(response => {
      results = response.results;
      results.forEach(result => {
        renderSongDisplay(result);
      });
    });

  });




  $(document).on("click", ".add-music-button", function () {
    playButton = $(this);
    updateDBIfObjectDoesntExist(playButton);
  });

  $(".fav-input-btn").on("click", () => {
    console.log("we got into favorites");
    $(".main-search-result-continer").find(".col").empty();

    for (var i = 0; i < globalUserProfile.artists.length; i++) {
      console.log({ i });
      var artistCardDisplay = getCardDisplay(globalUserProfile.artists[i], globalUserProfile.albums[i],
        globalUserProfile.songs[i]);

      cardDisplay(i + 1, artistCardDisplay);
    }
  });


});

