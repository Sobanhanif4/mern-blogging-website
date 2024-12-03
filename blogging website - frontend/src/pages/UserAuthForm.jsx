import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/InputBox";
import googleIcon from "../imgs/google.png";
import PageAnimation from "../common/PageAnimation";
import { Toaster, toast } from "react-hot-toast";
import { useContext, useRef } from "react";
import axios from "axios";
import { storeInSession, lookInSession, removeFromSession, logOutUser } from "../common/session";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {

    const authForm = useRef()

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext)


    const userAuthThroughServer = (serverRoute, formData) => {


        axios.post('http://localhost:3001' + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data))
                
                setUserAuth(data)

            })
            .catch(({ response }) => {
                toast.error(response.data.error)
            })
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        let form = new FormData(formElement);
        // console.log(form);

        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;

        }

        let { fullname, email, password } = formData;

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be atleast 3 letters")
            }
        }
        if (!email.length) {
            return toast.error("Enter Email")
        }
        if (!emailRegex.test(email)) {
            return toast.error("Email is invalid")
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters long with a 1 lowercase and 1 uppercase letters")
        }

        userAuthThroughServer(serverRoute, formData)
    }

    return (
        access_token ?
        <Navigate to="/" /> 
        :
        <PageAnimation keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form id="formElement" action="" className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type == "sign-in" ? "Welcome Back" : "Join Us Now"}
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

                    <button className="btn-dark center mt-14" type="submit"
                        onClick={handleSubmit}
                    >
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


