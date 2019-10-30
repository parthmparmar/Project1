// function to take input from search field and request 10 similar items from tastedive api

// get this value from html using jquery
var searchValue = "drake";
var searchType = "music";
// key for tasteDiveKey
var tasteDiveKey = "348203-ClassPro-YG3CBL5R";
// search limit for the aip to result
var searchLimit = 9;
var resultsArray = [];

tasteDive(searchValue, searchType, tasteDiveKey, searchLimit);

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
    console.log(resultsArray);
  });

}