var firebaseConfig = {
    apiKey: "AIzaSyBHK6xmt8nJjEx-1ALGRF73NdXyn0AI8Gc",
    authDomain: "project1version2.firebaseapp.com",
    databaseURL: "https://project1version2.firebaseio.com",
    projectId: "project1version2",
    storageBucket: "project1version2.appspot.com",
    messagingSenderId: "885016440307",
    appId: "1:885016440307:web:d019bee8fba4dc5b62b686"
 };


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

var globalUser;
var globalUserProfile;
var albumIds = [];
var artistIds = [];

class Profile {
    constructor(artists, albums, songs) {
        this.artists = artists;
        this.albums = albums;
        this.songs = songs;
    }
}

class Song {
    constructor(id, obj) {
        this.id = id,
        this.name = obj.name, 
        this.duration = obj.duration,
        this.price = obj.price,
        this.releaseDate = obj.releaseDate,
        this.url = obj.songURL, 
        this.trackNumber = obj.trackNumber
    }
}

class Album {
    constructor(id, obj) {
        this.id = id;
        this.name = obj.name;
        this.genre = obj.genre;
        this.price = obj.price;
        this.imageUrl = obj.imageUrl;
    }
}

class Artist {
    constructor(id, obj) {
        this.id = id;
        this.name = obj.name;
    }
}

async function setUserProfileArtist(songId) {
    var snapshot = await db.collection("ArtistsSongs").where("songId", "==", parseInt(songId)).get();

    snapshot.docs.forEach(async doc => {
        var artistId = doc.data().artistId;
        if(!artistIds.includes(artistId)) {
            artistIds.push(artistId);

            var artistData = await db.collection("Artists").doc(artistId.toString()).get();
            var newArtist = new Artist(artistId, artistData.data());
            globalUserProfile.artists.push(newArtist);
        }
    });
}

async function setUserProfileAlbum(id) {
    var snapshot = await db.collection("AlbumsSongs").where("songId", "==", parseInt(id)).get();

    snapshot.docs.forEach(async doc => {
        var albumId = doc.data().albumId;
        if(!albumIds.includes(albumId)) {
            albumIds.push(albumId);

            var albumData = await db.collection("Albums").doc(albumId.toString()).get();
            var newAlbum = new Album(albumId, albumData.data());
            globalUserProfile.albums.push(newAlbum);
        }
    });
}

async function getSongIdsPromise(songId) {
    var snapshot = await db.collection("UsersSongs").where("userId", "==", songId).get();
    
    return snapshot;
}

async function setUserProfileSongs(promise) {
    songs = [];

    promise.then(snapshot => {
        snapshot.docs.forEach(async doc => {
            var id = doc.data().songId.toString();
            var song = await db.collection("Songs").doc(id).get();

            var newSong = new Song(id, song.data());
            globalUserProfile.songs.push(newSong);
            setUserProfileAlbum(id);
            setUserProfileArtist(id)
        });
    });
}

 function createUser(userId, firstName, lastName, email) {
    db.collection("Users").doc(userId).set({
        firstName: firstName,
        lastName: lastName,
        email: email
    });
 }

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
});

// Or with jQuery

$(document).ready(function () {
    const userSignUpForm = $("#user-sign-up-form");
    const userLoginForm = $("#user-login-form");
    $(".modal").modal();

    $(".sign-up-input-link").on("click", () => {
        console.log("we in this bitch");
        $("#user-sign-up-modal").modal("open");
    })

    userSignUpForm.on("submit", event => {
        event.preventDefault();
        console.log("we got in here");

        const firstName = $("#user-first-name-input").val();
        const lastName = $("#user-last-name-input").val();
        const email = $("#user-email-input").val();
        const password = $("#user-password-input").val();

        console.log({firstName, lastName, email, password});
        
        auth.createUserWithEmailAndPassword(email, password).then(credential => {
            user = credential.user;
            createUser(credential.user.uid, firstName, lastName, email);
            
        }).catch(error => {
            console.log({ error });
            console.log(error.message);
        })

        $("#user-sign-up-form").trigger("reset");
        // $(".modal").trigger("hide");
    });

    $(".login-input-link").on("click", () => {
        console.log("we in this bitch");
        $("#user-login-modal").modal("open");
    });

    userLoginForm.on("submit", event => {
        event.preventDefault();

        const email =$("#login-email-input").val();
        const password = $("#login-password-input").val();
        auth.signInWithEmailAndPassword(email, password).then(credential => {
            console.log("user logged in");
            console.log(credential.user.uid);
        }).catch(error => {
            console.log(error.message);
        })
        $("#user-login-form").trigger("reset");
    });

    $(".user-logout-link").on("click", () => {
        console.log("user signed out");
        auth.signOut();
    })

    auth.onAuthStateChanged(user => {
        if(user) {
            globalUser = user.uid;
            globalUserProfile = new Profile([], [], []);

            var songIdPromise = getSongIdsPromise(globalUser);
            setUserProfileSongs(songIdPromise);

        } else {
            console.log("user logged out");
            console.log({user});
        }
     });
});
