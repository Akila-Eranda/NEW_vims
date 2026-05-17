import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import Navbar from "components/Navbars/AuthNavbar.js";
import FooterSmall from "components/Footers/FooterSmall.js";

// views
import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
import Onboard from "views/auth/Onboard";

export default function Auth() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Switch>
            <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/onboard/:userData" exact component={Onboard} />
            <Redirect from="/auth" to="/auth/login" />
          </Switch>
        </div>
      </main>
    </>
  );
}