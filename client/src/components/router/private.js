import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        Cookies.get("stream-token") === undefined ? (
          <Redirect to="/auth" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
export default PrivateRoute;
