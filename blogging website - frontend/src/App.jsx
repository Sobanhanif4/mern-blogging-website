import { Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        
        let userInSession = lookInSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    }, [])


    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Routes>
                {/* This is the main route wrapping all others */}
                <Route path="/" element={<NavbarComponent />}>
                    {/* Nested routes */}
                    <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    );
};

export default App;
