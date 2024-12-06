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

// export const authWithGoogle = async () => {
//     let user = null;

//     await signInWithPopup(auth, provider).then((result)=>{
//         user = result.user
//    }).catch((err)=>{
//     console.log(err);
    
//    })
// }

export const authWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Firebase Result: ", result); // Debugging step
        const user = result.user;
        return user;
    } catch (err) {
        console.error("Error during Google authentication:", err);
        throw err;
    }
}




// const provider = new GoogleAuthProvider();
// const auth = getAuth();

// export const authWithGoogle = async () => {
//   let user = null;
//   try {
//     const result = await signInWithPopup(auth, provider);
//     user = result.user;  // The authenticated user
//     console.log("User signed in:", user);
//   } catch (error) {
//     // Handle specific errors
//     if (error.code === 'auth/popup-closed-by-user') {
//       console.log("Popup was closed by the user.");
//     } else {
//       console.error("Error during sign-in:", error);
//     }
//   }
// };

// export const authWithGoogle = async () => {
//     let user = null;
//     try {
//       const result = await signInWithPopup(auth, provider);
//       user = result.user;  // The authenticated user
//       console.log("User signed in:", user);
      
//       // Get the Firebase ID token (accessToken)
//       const idToken = await user.getIdToken(); 
      
//       // Return the user object with accessToken
//       return { ...user, accessToken: idToken };
//     } catch (error) {
//       // Handle specific errors
//       if (error.code === 'auth/popup-closed-by-user') {
//         console.log("Popup was closed by the user.");
//       } else {
//         console.error("Error during sign-in:", error);
//       }
//       throw error;  // Propagate the error to be handled by the caller
//     }
//   };
  