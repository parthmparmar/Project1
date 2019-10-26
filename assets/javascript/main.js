var playAudio;
var audio;
var artist_obj = [];
var id_count = -1;
var playing_id;
var error;
var songPlaying = false;

var searchType = "music";
// key for tasteDiveKey
var tasteDiveKey = "348203-ClassPro-YG3CBL5R";
// search limit for the aip to result 
var searchLimit = 9;
var resultsArray = [];

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
        console.log(songPlaying);
        console.log($(this).attr("data-audio-status"));
        console.log(playing_id)
        
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
        // check if shit exists in the database or not
        $("#artistDescription").empty();
        var artistClicked = $(this).text()
        var audioQueryURL = "https://cors-anywhere.herokuapp.com/" + "theaudiodb.com/api/v1/json/1/search.php?s=" + artistClicked;

        $.ajax({
            url: audioQueryURL,
            method: "GET"
        })
            .then(function (response) {
                // console.log(response);
                var result = response.artists;
                // console.log("audio" +result);
                var artistBio = result[0].strBiographyEN;
                // console.log(typeof artistBio);
               
                // console.log(result[0].strBiographyEN);
                    // console.log(artist);
                    console.log(artistBio );
                // console.log(artist);
                $("#artistDescription").append(artistBio);


            });

    });

});