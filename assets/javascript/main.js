$(document).ready(function () {
    $("#userArtistInput").on("click", function (event) {
        event.preventDefault();

        setInterval(loadingGIF, 3000);
        function loadingGIF() {
            var loadingImage = $("<img>");
            loadingImage.attr("src", "assets/loading.gif");
            $(".main-search-result-continer").append(loadingImage);
        }



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
                        var finalArtistName = $("<div>");
                        finalArtistName.attr("class", "artist-name");
                        finalArtistName.text(JSON.stringify(result[0].artistName));
                        var trackName = $("<p>");
                        trackName.text(JSON.stringify(result[0].trackName));
                        var artistImage = $("<img>");
                        artistImage.attr({
                            "class": "imageClick",
                            "src": result[0].artworkUrl100,
                        });
                        artistImage.attr("play", result[0].previewUrl)
                        $(".imageClick").on("click", function () {
                            var playAudio = $(this).attr("play");
                            var audio = new Audio(playAudio);
                            audio.play();

                        });

                        $(".main-search-result-continer").append(artistImage, finalArtistName, trackName);

                    });

            }
        }
    });
});