

var tasteDiveArray = ["lizzo", "beyonce", "celine dion", "shania twain", "cher", "billy joel"];


// /v1/artists/{id}
function callItunesAPI(){
    for(var i=0; i<tasteDiveArray.length; i++){
        var artistNameFromArray = tasteDiveArray[i]
        console.log(artistNameFromArray);
        var queryURL ="https://cors-anywhere.herokuapp.com/"+ "https://itunes.apple.com/search?term=" + artistNameFromArray + "&limit=1";  
   
$.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
    //   console.log(typeof response);
             var result = JSON.parse(response).results;
        console.log(result);
        // console.log(response[0])
        // console.log(result[0].artworkUrl100);
        // console.log(result[0].artistName);
        // console.log(result[0].primaryGenreName);
        // console.log(result[0].trackName);      
        // console.log(result[0].previewUrl);
        var finalArtistName = $("<div>");
       finalArtistName.attr("class", "artist-name");
       finalArtistName.text(JSON.stringify(result[0].artistName));
   
        console.log(finalArtistName +"should be artistname");
        var artistImage = $("<img>");
        artistImage.attr("src", result[0].artworkUrl100);
        artistImage.attr("alt", "artist");
        $(".main-search-result-continer").append(artistImage, finalArtistName);
        
    });

}}
callItunesAPI();