import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { PrivateRoute, Header } from "components";
import {
  Auth,
  Register,
  Forgot,
  Reset,
  Account,
  Home,
  Titles,
  Stream,
} from "pages";
import { User } from "context/user";
import "antd/dist/antd.dark.css";
import "./app.scss";
import axios from "axios";
import Cookies from "js-cookie";
const App = () => {
  const [user, setUser] = useState(false);
  useEffect(() => {
    if (Cookies.get("stream-token")) {
      axios
        .get("/api/account")
        .then((response) => {
          if (response.data.status) {
            setUser(response.data.user);
          } else {
            Cookies.remove("stream-token");
            return <Redirect to="/auth" />;
          }
        })
        .catch(() => {
          Cookies.remove("stream-token");
          return <Redirect to="/auth" />;
        });
    }
  }, []);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <Router>
      <User.Provider value={value}>
        <Header />
        <main className="app">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={Auth} />
            <Route exact path="/auth/create" component={Register} />
            <Route exact path="/auth/forgot" component={Forgot} />
            <Route path="/auth/reset/:token([0-9a-z]{36})" component={Reset} />
            <PrivateRoute path="/titles/:id([0-9a-z]{24})" component={Titles} />
            <PrivateRoute exact path="/account" component={Account} />
            <PrivateRoute
              exact
              path="/stream/:title([0-9a-z]{24})/:episode([0-9a-z]{24})"
              component={Stream}
            />
            <Redirect to="/" />
          </Switch>
        </main>
      </User.Provider>
    </Router>
  );
};
export default App;
