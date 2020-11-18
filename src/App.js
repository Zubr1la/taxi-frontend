import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from './Routes/Home';
import NotFound from "./Routes/NotFound";
import NavBar from "./Components/NavBar";
import Panel from "./Routes/Panel";
import Login from "./Routes/Login";
import Register from "./Routes/Register";
import UserSettings from "./Routes/UserSettings";
import Messages from "./Routes/Messages";
import MainPage from "./Routes/MainPage";


function App() {
  return (
      <Router>
          <div>
              <NavBar/>
              <Switch>
                  <Route exact path="/">
                      <Home />
                  </Route>
                  <Route exact path="/orderdrive">
                      <MainPage />
                  </Route>
                  <Route exact path="/login">
                      <Login />
                  </Route>
                  <Route exact path="/register">
                      <Register />
                  </Route>
                  <Route exact path="/panel">
                      <Panel />
                  </Route>
                  <Route exact path="/usersettings">
                      <UserSettings />
                  </Route>
                  <Route exact path="/messages">
                      <Messages />
                  </Route>
                  <Route component={NotFound}/>
              </Switch>

          </div>
      </Router>
  );
}

export default App;
