$(document).ready(function () {
    $("#userArtistInput").on("click", function (event) {
        event.preventDefault();
        $(".main-search-result-continer").empty();


        var searchValue = $("#userSearch").val().trim();
        console.log(searchValue);
        var searchType = "music";
        // key for tasteDiveKey
        var tasteDiveKey = "348203-ClassPro-YG3CBL5R";
        // search limit for the aip to result 
        var searchLimit = 9;
        var resultsArray = [];

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
                // console.log(resultsArray);
                callItunesAPI();
            });

        }
        function callItunesAPI() {
            for (var i = 0; i < resultsArray.length; i++) {
                var artistNameFromArray = resultsArray[i]
                // console.log(artistNameFromArray);
                var queryURL = "https://cors-anywhere.herokuapp.com/" + "https://itunes.apple.com/search?term=" + artistNameFromArray + "&limit=1";

                $.ajax({
                    url: queryURL,
                    method: "GET"
                })
                    .then(function (response) {
                        var result = JSON.parse(response).results;
                        // console.log(result);
                        // console.log(response[0])
                        // console.log(result[0].artworkUrl100);
                        // console.log(result[0].artistName);
                        // console.log(result[0].primaryGenreName);
                        // console.log(result[0].trackName);      
                        // console.log(result[0].previewUrl);
                        var finalArtistName = $("<div>");
                        finalArtistName.attr("class", "artist-name");
                        finalArtistName.text(JSON.stringify(result[0].artistName));
                        var trackName = $("<p>");
                        trackName.text(JSON.stringify(result[0].trackName));
                        var artistImage = $("<img>");
                        artistImage.attr("src", result[0].artworkUrl100);
                        artistImage.attr("alt", "artist");
                        // var playTrack = $("<audio>").attr("src", result[0].previewUrl);
                        // // playTrack.attr("src", result[0].previewUrl);
                        // playTrack.play();
                        $(".main-search-result-continer").append(artistImage, finalArtistName, trackName);

                    });

            }
        }
    });
});