var playAudio;
var audio;
var artist_obj = [];
var id_count = -1;
var playing_id;
var error;
var songPlaying = false;
var results;
var playButton;
var caseAdded;

var searchType = "music";
// key for tasteDiveKey
var tasteDiveKey = "348203-ClassPro-YG3CBL5R";
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

function renderSongDisplay(result) {
    if(result.wrapperType != "track" || result.kind != "song") {
        return;
    }

    var songDisplayTable = $(".song-display-table");
    newRow = $("#song-display-row").clone();
    newRow.removeClass("hidden");

    var playButton = $(newRow.children()[2]).children()[0];
    
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
    console.log("got in the get collection promise function");
    console.log("Looking for: " + artistId + " in " + collectionName + " collection");
    var promise = await db.collection(collectionName).doc(artistId.toString()).get();
    console.log("this is the promise we got: " + promise);

    return promise;
}

async function updateDBIfObjectDoesntExist(playButton) {
    var entryAdded = false;
    var cases = ["Artists", "Albums", "Songs"];
    var ids = [playButton.attr("data-artist-id"), playButton.attr("data-album-id"), playButton.attr("data-song-id")];
    var promises = [];

    ids.forEach((id, i) => {
        promises.push(getCollectionPromise(cases[i], id));
    });

    promises.forEach((promise, i) => {
        promise.then(doc => {
            if(doc.exists) {
                return;
            } 

            switch(i) {
                case 0: 
                    console.log("artist was not in db, adding to user and db") 
                    entryAdded = true;
                    createArtist(playButton);
                    createArtistSongEntry(playButton);
                    createAlbum(playButton);
                    createAlbumSongEntry(playButton);
                    createSong(playButton);
                    createUserSongEntry(playButton);
                    break;

                case 1:
                    console.log("album was not in db, adding to user and db") 

                    entryAdded = true;
                    createArtistSongEntry(playButton);
                    createAlbum(playButton);
                    createAlbumSongEntry(playButton);
                    createSong(playButton);
                    createUserSongEntry(playButton);
                    break;

                case 2:
                    console.log("song was not in db, adding to user and db");
                    entryAdded = true;
                    createSong(playButton);
                    createUserSongEntry(playButton);
                    createArtistSongEntry(playButton);
                    break;

                default: 
                    break;
            }
        });

        if(entryAdded) {
            console.log("there was an entry added, so we got out of the loop");
            return;
        }
    });
}

function createUserSongEntry(userId, playButton) {
    db.collection("UsersSongs").add({
        userId: userId,
        songId: parseInt(playButton.attr("data-song-id"))
    });
}

function createArtistSongEntry(playButton) {
    db.collection("ArtistsAlbums").add({
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

    $("#userArtistInput").on("click", function (event) {
        event.preventDefault();

        if ($("#userSearch").val() == ""){
            console.log("shake");
            $("#empty-alert").removeClass("off");
            $("#userSearch").effect("shake");
        }

        if ($("#userSearch").val() != ""){
            $(".errorStyle").empty();
            $("#empty-alert").addClass("off");
            $(".main-search-result-continer").find(".col").empty();
            id_count = 0;
            resultsArray = [];
            artist_obj = [];
    
    
            var searchValue = $("#userSearch").val().trim().toUpperCase();
            
            $(".recomendations-result-container").text(searchValue);
    
            tasteDive(searchValue, searchType, tasteDiveKey, searchLimit);
        };

        function tasteDive(value, type, key, limit) {
            queryURL = "https://cors-anywhere.herokuapp.com/" + "https://tastedive.com/api/similar?q=" + value + "&type=" + type + "&k=" + key + "&limit=" + limit;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (results) {
                results.Similar.Results.forEach(function (item) {
                    resultsArray.push(item.Name);
                });

                if (resultsArray.length == 0) {
                    error = true;
                    console.log("error");
                    var error = $("<p>");
                    error.attr("class", "errorStyle");
                    error.text(searchValue + " was not found. Please try again.");
                    $(".main-search-result-continer").append(error);
                }
                else {
                    console.log(artist_obj)
                    callItunesAPI();
                };
            });
            $("#userSearch").val('');
        }
        
        function callItunesAPI() {
            var artist
            for (var i = 0; i < resultsArray.length; i++) {
                var artistNameFromArray = resultsArray[i]
                var queryURL = "https://cors-anywhere.herokuapp.com/" + "https://itunes.apple.com/search?term=" + artistNameFromArray + "&limit=1";
                $.ajax({
                    url: queryURL,
                    method: "GET"
                })
                    .then(function (response) {
                        var result = JSON.parse(response).results;
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
        var masterCard = $("#card");
        var newCard = masterCard.clone(true);
        newCard.attr("id", "card" + (item));
        newCard.removeClass("off");
        newCard.find(".artist-image").attr("src",object_artist.imageURL);
        newCard.find(".artist-name").text(object_artist.name);
        newCard.find(".genre").text("Genre: " +object_artist.genre);
        newCard.find(".song").text("Track Name: " +object_artist.songName);
        newCard.find(".imageClick").attr("src", object_artist.songURL);
        $("#" + (item)).append(newCard);
    };

    
    $(document).on("click", ".imageClick", function () {
        if (songPlaying == false) {
            if ($(this).attr("data-audio-status") != "playing") {
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

    $(".modal-trigger").on("click", function() {
        var queryURL = "https://cors-anywhere.herokuapp.com/" + "https://itunes.apple.com/search?term=" + $(this).text() + "&limit=25";

        var childRows = $("tbody").children();
        for(var i = 1; i < childRows.length; i++) {
            childRows[i].remove();
        }

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(response => {
            results = JSON.parse(response).results;
            results.forEach(result => {
                renderSongDisplay(result);
            });
        });
 
    });

    $(document).on("click", ".add-music-button", function() {
        playButton = $(this);
        console.log("we got clicked the add button");
        /*
        for db: 
        1. check if the artist exists (if the artist doesn't exist, then the album and song don't exist... this will also be 
        true for the user)
        2. check if the album exists (if the album doesn't exists, then the song doesn't exist. This will also be true for the user)
        3. check if the song exists 

        for user: 

        */
        updateDBIfObjectDoesntExist(playButton);
    });
});

