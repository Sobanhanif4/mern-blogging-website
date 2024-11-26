// import { Link } from "react-router-dom";
// import InputBox from "../components/InputBox";
// import googleIcon from "../imgs/google.png";
// import PageAnimation from "../common/PageAnimation";
// import { useRef } from "react";
// import { Toaster, toast } from "react-hot-toast";
// import axios from "axios";

// const UserAuthForm = ({ type }) => {

//     const authForm = useRef();

//     const userAuthThroughServer = (serverRoute, formData) => {

//         console.log(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData);


//         axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
//             .then(({ data }) => {
//                 console.log(data);
//             })
//             .catch(({ response }) => {
//                 toast.error(response.data.error)
//             })

//     }

//     const handleSubmit = (e) => {

//         e.preventDefault();

//         let serverRoute = type == "sign-in" ? "/signin" : "/signup"

//         let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
//         let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

//         let form = new FormData(authForm.current);
//         let formData = {};

//         for (let [key, value] of form.entries()) {
//             formData[key] = value;

//         }
//         let { fullname, email, password } = formData;

//         if (fullname) {
//             if (fullname.length < 3) {
//                 return toast.error("Fullname must be atleast 3 letters")
//             }
//         }
//         if (!email.length) {
//             return toast.error("Enter Email")
//         }
//         if (!emailRegex.test(email)) {
//             return toast.error("Email is invalid")
//         }
//         if (!passwordRegex.test(password)) {
//             return toast.error("Password should be 6 to 20 characters long with a 1 lowercase and 1 uppercase letters")
//         }

//         userAuthThroughServer(serverRoute, formData)
//     }

//     return (
//         <PageAnimation keyValue={type}>
//             <section className="h-cover flex items-center justify-center">
//                 <Toaster />
//                 <form ref={authForm} action="" className="w-[80%] max-w-[400px]">
//                     <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
//                         {type == "sign-in" ? "Welcome Back" : "Join Us Now"}
//                     </h1>

//                     {type !== "sign-in" && (
//                         <InputBox
//                             name="fullname"
//                             type="text"
//                             placeholder="Full name"
//                             icon="fi-rr-user"
//                         />
//                     )}

//                     <InputBox
//                         name="email"
//                         type="email"
//                         placeholder="Email"
//                         icon="fi-rr-envelope"
//                     />
//                     <InputBox
//                         name="password"
//                         type="password"
//                         placeholder="Password"
//                         icon="fi-rr-key"
//                     />

//                     <button className="btn-dark center mt-14" type="submit"
//                         onClick={handleSubmit}
//                     >
//                         {type.replace("-", " ")}
//                     </button>

//                     <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
//                         <hr className="w-1/2 border-black" />
//                         <p>or</p>
//                         <hr className="w-1/2 border-black" />
//                     </div>

//                     <button className="btn-dark flex items-center justify-content gap-4 w-[90%] center">
//                         <img src={googleIcon} className="w-5" alt="Google Icon" />
//                         continue with google
//                     </button>

//                     {type === "sign-in" ? (
//                         <p className="mt-6 text-dark-grey text-xl text-center">
//                             Don't have an account?
//                             <Link to="/signup" className="underline text-black text-xl ml-1">
//                                 Join Us today!
//                             </Link>
//                         </p>
//                     ) : (
//                         <p className="mt-6 text-dark-grey text-xl text-center">
//                             Already have an account?
//                             <Link to="/signin" className="underline text-black text-xl ml-1">
//                                 Sign in here.
//                             </Link>
//                         </p>
//                     )}
//                 </form>
//             </section>
//         </PageAnimation>
//     );
// };

// export default UserAuthForm;


import { Link } from "react-router-dom";
import InputBox from "../components/InputBox";
import googleIcon from "../imgs/google.png";
import PageAnimation from "../common/PageAnimation";
import { useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const UserAuthForm = ({ type }) => {
    const authForm = useRef();

    const userAuthThroughServer = (serverRoute, formData) => {
        console.log("Sending data to server:", formData);
        
        const serverUrl = `${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`;
        console.log("Final URL:", serverUrl); // Log the final URL to check it's correct
        
        // Send data to server
        axios.post(serverUrl, formData)
            .then(({ data }) => {
                console.log(data); // Log server response
            })
            .catch(({ response }) => {
                console.error(response); // Log error from backend
                toast.error(response.data.error); // Show error message
            });
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Ensure serverRoute is set based on the type
        let serverRoute = type === "sign-in" ? "/signin" : "/signup";
        console.log("Server route:", serverRoute); // Log to check if it's correct
    
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
    
        let form = new FormData(authForm.current);
        let formData = {};
    
        for (let [key, value] of form.entries())
            formData[key] = value;
    
        let { fullname, email, password } = formData;
    
        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be at least 3 letters");
            }
        }
        if (!email.length) {
            return toast.error("Enter Email");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Email is invalid");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters long with 1 lowercase and 1 uppercase letter");
        }
    
        // Pass serverRoute and formData to the function
        userAuthThroughServer(serverRoute, formData);
    };
    

    return (
        <PageAnimation keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form ref={authForm} action="" className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === "sign-in" ? "Welcome Back" : "Join Us Now"}
                    </h1>

                    {type !== "sign-in" && (
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Full name"
                            icon="fi-rr-user"
                        />
                    )}

                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    />
                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />

                    <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>
                        {type.replace("-", " ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    <button className="btn-dark flex items-center justify-content gap-4 w-[90%] center">
                        <img src={googleIcon} className="w-5" alt="Google Icon" />
                        continue with google
                    </button>

                    {type === "sign-in" ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account?
                            <Link to="/signup" className="underline text-black text-xl ml-1">
                                Join Us today!
                            </Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already have an account?
                            <Link to="/signin" className="underline text-black text-xl ml-1">
                                Sign in here.
                            </Link>
                        </p>
                    )}
                </form>
            </section>
        </PageAnimation>
    );
};

export default UserAuthForm;
