import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyBHWRhMyH8kYPs6KkYaVS3LHbB4mGcflr4",
    authDomain: "mern-blogging-web-72a84.firebaseapp.com",
    projectId: "mern-blogging-web-72a84",
    storageBucket: "mern-blogging-web-72a84.firebasestorage.app",
    messagingSenderId: "4476226217",
    appId: "1:4476226217:web:808946576a99c2d6c7f7b8"
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider()

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider).then((result)=>{
        user = result.user
   }).catch((err)=>{
    console.log(err);
    
   })
}