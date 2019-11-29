import React, { createContext } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from "./pages/Login"
import Register from "./pages/Register";
import AddSurvey from "./pages/AddSurvey";
import Survey from './pages/Survey';
import Nav from './components/Nav';
import MySurveys from "./components/MySurveys";


const AuthContext = createContext()

class App extends React.Component {
  state = {
    isAuth: false,
    currentUser: ""
  }
  componentDidMount() {
    this.setState({
      isAuth: localStorage.getItem("email") === null ? false : true
    })
  }

  login = (email) => {
    localStorage.setItem("email", email)
    this.setState({
      isAuth: true,
      currentUser: localStorage.getItem('email')
    })
  }

  logout = () => {
    this.setState({
      isAuth: false,
      currentUser: ""
    })
    localStorage.removeItem("email")
  }
  render() {
    return (
      <AuthContext.Provider value={{ isAuth: this.state.isAuth, currentUser: this.state.currentUser, login: this.login, logout: this.logout }}>
        <div className="App">
          <BrowserRouter>
            <Nav />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/add-survey" component={AddSurvey} />
              <Route path="/survey/:name" component={Survey} />
              <Route path="/my-surveys" component={MySurveys} />
            </Switch>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>

    );
  }

}

export { AuthContext }
export default App;
