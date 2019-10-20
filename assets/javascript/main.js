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

// grabbing onto user credentials modal
let userCredentialsModal = document.getElementById("user-credentials-modal");

// grabbing onto all links to bring up modal
let userCredentialLinks = document.querySelectorAll(".page-link");

var modalTitle;

userCredentialLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();
    
        userCredentialsModal.style.display = "block";
        modalTitle = document.getElementById("user-credentials-input-title");
        modalTitle.textContent = link.textContent;
    });    
});

// starting sign up information
let userCredentialsForm = document.getElementById("user-credentials-form");

userCredentialsForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // grabbing user info
    const email = signUpForm["user-email-input"].value;
    const password = signUpForm["user-password-input"].value;

    switch(modalTitle.textContent) {
        case "Sign Up":
            console.log("it was sign up");
            // signing up the user (literally all you have to do... it's sick!)
            auth.createUserWithEmailAndPassword(email, password).then(function(credential) {
                console.log(credential.user);
            });

            break;
        case "Login":
            console.log("it was login");
            auth.signInWithEmailAndPassword(email, password).then(credential => {
                console.log(credential.user);
            });
            break;
        case "Logout":
            console.log("it was logout");
            auth.signOut().then(function() {
                console.log("the user has logged out, and we should hide content");
            });
            break;
        default:
            break;
    }
});


// // grabbing onto login button
// const loginButton = document.getElementById("login-button");

// signUpForm.addEventListener("submit", function(event) {
//     event.preventDefault();
//     console.log("we got in here");


//     // getting user credentials
//     const email = signUpForm["user-email-input"].value;
//     const password = signUpForm["user-password-input"].value;

//     auth.signInWithEmailAndPassword(email, password).then(credential => {
//         console.log(credential.user);
//     });
// })