import checkToken from "api/checkToken";
import { getStoredTokens } from "auth/tokenService";

const { createContext, useContext, useState, useEffect } = require("react");

const AuthContext = createContext();


function AuthProvider({ children }) {

    const [auth, setAuth] = useState(() => {
        if (localStorage.getItem('user')) {
            if (getStoredTokens()) {
                return true
            }
            // return checkToken();
        } else {
            return false;
        }
    });

    // useEffect(() => {
    //     console.log("AuthConetext Loaded!");
    // }, [])

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )

}

function useAuth() {
    const context = useContext(AuthContext)
    return context
}

export { AuthProvider, useAuth }