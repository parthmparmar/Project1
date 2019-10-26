var firebaseConfig = {
    apiKey: "AIzaSyBHK6xmt8nJjEx-1ALGRF73NdXyn0AI8Gc",
    authDomain: "project1version2.firebaseapp.com",
    databaseURL: "https://project1version2.firebaseio.com",
    projectId: "project1version2",
    storageBucket: "project1version2.appspot.com",
    messagingSenderId: "885016440307",
    appId: "1:885016440307:web:d019bee8fba4dc5b62b686"
 };

 var globalUser;
 firebase.initializeApp(firebaseConfig);
 // making database and auth connection
 const db = firebase.firestore();
 const auth = firebase.auth();

 function createUser(userId, firstName, lastName, email) {
    db.collection("Users").doc(userId).set({
        firstName: firstName,
        lastName: lastName,
        email: email
    });
 }

 function getUserRef(userId) {
    var userRef = db.collection("Users").doc(userId).get();
    return userRef;
 }

 function createArtist(genre, imageURL, name, songName, songURL) {
    db.collection("Artists").add({
        genre: genre,
        imageURL: imageURL,
        name: name,
        songName: songName,
        songURL: songURL
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
        // do shit based on if the user is null or not
        if(user) {
            globalUser = user.uid;
            console.log(globalUser);
            var userData;
            getUserRef(user.uid).then(document => {
                userData = document.data();
                console.log(userData);
            });
        } else {
            console.log("user logged out");
            console.log({user});
        }
     });
    
    

});
