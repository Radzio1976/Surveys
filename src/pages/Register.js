import React from "react";
import axios from "axios";
import { API_URL } from '../consts/API_URL';
import { AuthContext } from '../App'
import { Redirect } from 'react-router-dom'

class Register extends React.Component {
    state = {
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                error: "Hasła są różne"
            })
            return
        }
        if (this.state.name.length < 5) {
            this.setState({
                error: "Imię musi mieć conajmniej 5 znaków"
            })
            return
        }
        if (this.state.surname.length < 5) {
            this.setState({
                error: "Nazwisko musi mieć conajmniej 5 znaków"
            })
            return
        }
        if (this.state.password.length < 5) {
            this.setState({
                error: "Hasło musi mieć conajmniej 5 znaków"
            })
            return
        }
        axios.post(API_URL + "/users/", { name: this.state.name, surname: this.state.surname, email: this.state.email, password: this.state.password }).then((response) => {
            this.props.history.push("/login")
        })

    }

    render() {
        return (
            <div className="registration">
                <div className="registration-container">
                    <AuthContext.Consumer>
                        {
                            ({ isAuth }) => {
                                return (
                                    isAuth ?
                                        <Redirect to="/" /> :
                                        <form className="registration-form" onSubmit={this.handleSubmit} noValidate>
                                            <label className="form-label">Imię</label>
                                            <br />
                                            <input className="form-input" type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                                            <br />
                                            <label className="form-label">Nazwisko</label>
                                            <br />
                                            <input className="form-input" type="text" name="surname" value={this.state.surname} onChange={this.handleChange} />
                                            <br />
                                            <label className="form-label">Email</label>
                                            <br />
                                            <input className="form-input" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                                            <br />
                                            <label className="form-label">Podaj hasło</label>
                                            <br />
                                            <input className="form-input" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                                            <br />
                                            <label className="form-label">Potwierdź hasło</label>
                                            <br />
                                            <input className="form-input" type="password" name="confirmPassword" value={this.state.conformPassword} onChange={this.handleChange} />
                                            <br />
                                            <button className="main-nav-login-button button">Zarejestruj</button>
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

export default Register