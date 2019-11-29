import React from "react";
import Axios from "axios";
import { Redirect } from 'react-router-dom'
import { AuthContext } from '../App'

class Login extends React.Component {
    state = {
        email: "r.tomaszewski@gmail.com",
        password: "abcdef"
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e, login) => {
        e.preventDefault()
        Axios.get(`http://localhost:3000/users?password=${this.state.password}&email=${this.state.email}`).then((response) => {
            if (response.data.length === 0) {
                this.setState({
                    error: "Nieprawidłowy login lub hasło"
                })
            } else {
                login(this.state.email)
                this.props.history.push("/add-survey")
            }
        })
    }

    render() {
        return (
            <div className="login">
                <div className="login-container">
                    <AuthContext.Consumer>
                        {
                            ({ isAuth, login }) => {
                                return (
                                    isAuth ?
                                        <Redirect to="/" /> :
                                        <form className="login-form" onSubmit={(e) => this.handleSubmit(e, login)}>
                                            <label className="form-label">E-mail</label>
                                            <br />
                                            <input className="form-input" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                                            <br />
                                            <label className="form-label">Hasło</label>
                                            <br />
                                            <input className="form-input" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                                            <br />
                                            <button className="main-nav-login-button button">zaloguj</button>
                                            <p>{this.state.error}</p>
                                        </form>
                                )
                            }
                        }
                    </AuthContext.Consumer>
                </div>
            </div>
        )
    }
}

export default Login