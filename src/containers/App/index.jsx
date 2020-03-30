import React, { Component } from "react";
// import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "assets/css/material-dashboard-react.css?v=1.5.0";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import indexRoutes from "routes/index.jsx";
import ForgotPassword from "layouts/SignIn/ForgotPassword.jsx";
import ChangePassword from "layouts/SignIn/ChangePassword.jsx";
import SignIn from "layouts/SignIn/SignIn.jsx";
import InvalidPage from "layouts/404.jsx";

import { SnackbarProvider } from "notistack";

// const hist = createBrowserHistory();

class App extends Component {
  state = {
    account: ""
  };

  render() {
    return (
      <Router>
        <SnackbarProvider maxSnack={3}>
          <div className="App">
            <Switch>
              <Route path="/404" component={InvalidPage} />
              <Route path="/signin" component={SignIn} />
              <Route path="/changepassword" component={ChangePassword} />
              <Route path="/forgotpassword" component={ForgotPassword} />

              {indexRoutes.map((prop, key) => {
                return (
                  <Route
                    path={prop.path}
                    key={key}
                    render={props => <prop.component {...props} />}
                  />
                );
              })}
            </Switch>
          </div>
        </SnackbarProvider>
      </Router>
    );
  }
}

export default App;
