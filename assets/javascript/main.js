var playAudio;
var audio;
var artist_obj = [];
var id_count = -1;
var playing_id;
var error;

var searchType = "music";
// key for tasteDiveKey
var tasteDiveKey = "348203-ClassPro-YG3CBL5R";
// search limit for the aip to result 
var searchLimit = 9;
var resultsArray = [];

$(document).ready(function () {


    $("#userArtistInput").on("click", function (event) {
        event.preventDefault();

        // $(".main-search-result-continer").empty();
        id_count = 0;


        var searchValue = $("#userSearch").val().trim().toUpperCase();
        
        $(".recomendations-result-container").text(searchValue);

        tasteDive(searchValue, searchType, tasteDiveKey, searchLimit);

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
                    error.text("no results! try again");
                    $(".main-search-result-continer").append(error);
                }
                else {
                    callItunesAPI();
                };
            });

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
        newCard.find(".genre").text(object_artist.genre);
        newCard.find(".song").text(object_artist.songName);
        $("#" + (item)).append(newCard);
    };
    $(document).on("click", ".imageClick", function () {

        if ($(this).parent().attr("data-audio-status") != "playing") {
            if ($(this).attr("data-audio-status") != "playing") {
                playAudio = $(this).attr("play");
                audio = new Audio(playAudio);
                audio.play();
                $(this).attr("data-audio-status", "playing");
                $(this).parent().attr("data-audio-status", "playing");
                playing_id = $(this).parent().attr("id");
            }
        }

        else if ($(this).parent().attr("data-audio-status") == "playing") {
            if ($(this).attr("data-audio-status") == "playing") {
                audio.pause();
                $(this).attr("data-audio-status", "paused");
                $(this).parent().attr("data-audio-status", "paused");
            }
            else if ($(this).attr("data-audio-status") != "playing") {
                audio.pause();
                $("#" + playing_id).attr("data-audio-status", "paused");
                playAudio = $(this).attr("play");
                audio = new Audio(playAudio);
                audio.play();
                $(this).attr("data-audio-status", "playing");
            }
        }
    });

});