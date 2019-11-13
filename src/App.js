import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from "./pages/Login"
import Register from "./pages/Register";
import AddSurvey from "./pages/AddSurvey";
import Survey from './pages/Survey'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/add-survey" component={AddSurvey} />
          <Route path="/survey/:name" component={Survey} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}


export default App;
