import { Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import UserAuthForm from "./pages/UserAuthForm";

const App = () => {
    return (
        <Routes>
            {/* This is the main route wrapping all others */}
            <Route path="/" element={<NavbarComponent />}>
                {/* Nested routes */}
                <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                <Route path="signup" element={<UserAuthForm type="sign-up" />} />
            </Route>
        </Routes>
    );
};

export default App;
