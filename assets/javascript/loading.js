setInterval(loadingGIF, 1000);
function loadingGIF(){
    var loadingImage = $("<img>");
    loadingImage.attr("src", "assets/images/loadng.gif");
    $(".main-search-result-continer").append(loadingImage);
}