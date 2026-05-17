import React from 'react'
import { useAuth } from './AuthContext'
import { Redirect, Route } from 'react-router-dom/cjs/react-router-dom.min';

function ProtectedRoute({component: Component, ...rest}) {

    const {auth} = useAuth();


  return (
    <Route
      {...rest}
      render={(props) => auth ? <Component {...props} /> : <Redirect to = "/auth/login" />}
    >
    </Route>
  )
}

export default ProtectedRoute