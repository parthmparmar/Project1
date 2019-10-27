var favArtist = [];
var docId;
var findArtist;
var email = "test@email.com";
var counter = 0;

$(document).ready(function () {

    db.collection("Users").where("email", "==", email)
    .get()
    .then(function(user_info){
        db.collection("ArtistsUsers").where("userId", "==", user_info.docs[0].id).limit(16)
        .get()
        .then(function(snapshot){
            for (var i = 0; i < 9 && i<snapshot.docs.length; i++){
                docId = snapshot.docs[i].id.toString();
                var artistFav = db.collection("ArtistsUsers").doc(docId).get();
                artistFav.then(function(docs){
                    findArtist = docs.data().artistId.toString();
                    var artistLookup = db.collection("Artists").doc(findArtist).get();
                    artistLookup.then(function(artistFind){
                        favArtist.push(artistFind.data());
                        counter++
                        getFavArtist(artistFind.data(), counter);

                    });
                });
            };
        });
    });
});

function getFavArtist(objectArtist, count){
     if (objectArtist != ""){
        id_count = count
        cardDisplay_2(id_count, objectArtist);
     };
};

function cardDisplay_2(item, object_artist) {
    // create cards
    console.log(item)
    var masterCard = $("#card");
    var newCard = masterCard.clone(true);
    newCard.attr("id", "card" + (item));
    newCard.removeClass("off");
    // newCard.find(".artist-image").attr("src",object_artist.imageURL);
    newCard.find(".artist-name").text(object_artist.name);
    newCard.find(".genre").text("Genre: " +object_artist.genre);
    newCard.find(".song").text("Track Name: " +object_artist.songName);
    newCard.find(".imageClick").attr("src", object_artist.songURL);
    $("#" + (item)).append(newCard);
};

