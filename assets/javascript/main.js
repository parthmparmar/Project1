var firebaseConfig = {
    apiKey: "AIzaSyAzcCVVc9WPtxYSG76BMk87ENV_qBFSO7M",
    authDomain: "projectone-e2094.firebaseapp.com",
    databaseURL: "https://projectone-e2094.firebaseio.com",
    projectId: "projectone-e2094",
    storageBucket: "projectone-e2094.appspot.com",
    messagingSenderId: "50439559418",
    appId: "1:50439559418:web:6964fe4a8294811cf09143"
};

firebase.initializeApp(firebaseConfig);

// making database and auth connection 
const db = firebase.firestore();
const auth = firebase.auth();

// starting sign up information
const signUpForm = document.querySelector(".sign-up-form");

// adding an event listener on submission of the form
// signUpForm.addEventListener("submit", function(event) {
//     event.preventDefault();

//     // grabbing user info
//     const email = signUpForm["user-email-input"].value;
//     const password = signUpForm["user-password-input"].value;

//     // signing up the user (literally all you have to do... it's sick!)
//     auth.createUserWithEmailAndPassword(email, password).then(function(credential) {
//         console.log(credential.user);
//     });
// });

// grabbing onto logout button
const logoutButton = document.getElementById("logout-button");

// logging user out of application
logoutButton.addEventListener("click", function(event) {
    event.preventDefault();

    auth.signOut().then(function() {
        console.log("the user has logged out, and we should hide content");
    });
});

// grabbing onto login button
const loginButton = document.getElementById("login-button");

signUpForm.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("we got in here");


    // getting user credentials
    const email = signUpForm["user-email-input"].value;
    const password = signUpForm["user-password-input"].value;

    auth.signInWithEmailAndPassword(email, password).then(credential => {
        console.log(credential.user);
    });
})