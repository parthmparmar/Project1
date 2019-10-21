var firebaseConfig = {
    apiKey: "AIzaSyAzcCVVc9WPtxYSG76BMk87ENV_qBFSO7M",
    authDomain: "projectone-e2094.firebaseapp.com",
    databaseURL: "https://projectone-e2094.firebaseio.com",
    projectId: "projectone-e2094",
    storageBucket: "projectone-e2094.appspot.com",
    messagingSenderId: "50439559418",
    appId: "1:50439559418:web:6964fe4a8294811cf09143"
};

var user;

firebase.initializeApp(firebaseConfig);

// making database and auth connection 
const db = firebase.firestore();
const auth = firebase.auth();

// grabbing onto user credentials modal
let userCredentialsModal = document.getElementById("user-credentials-modal");

// grabbing onto all links to bring up modal
let userCredentialLinks = document.querySelectorAll(".credential-input-link");

let logOutLink = document.getElementById("user-logout");

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

    if(modalTitle === null) {
        return;
    }

    // grabbing user info
    const email = userCredentialsForm["user-email-input"].value;
    const password = userCredentialsForm["user-password-input"].value;

    switch(modalTitle.textContent) {
        case "Sign Up":
            // signing up the user (literally all you have to do... it's sick!)
            auth.createUserWithEmailAndPassword(email, password).then(function(credential) {
                console.log(credential.user);
                user = credential.user;
            });
            userCredentialsModal.style.display = "none";
            break;
        case "Login":
            auth.signInWithEmailAndPassword(email, password).then(credential => {
                console.log(credential.user);
            });
            userCredentialsModal.style.display = "none";
            var title = document.getElementById("user-login");
            title.textContent = "Logout";
            break;
        default:
            auth.signOut().then(function() {
                console.log("the user has logged out, and we should hide content");
            });

            var title = document.getElementById("user-login");
            title.textContent = "Logout";
            break;
    }
});

logOutLink.addEventListener("click", function(event) {
    event.preventDefault();

    
});

