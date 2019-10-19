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

// making database connection 
const db = firebase.firestore();
const auth = firebase.auth();

