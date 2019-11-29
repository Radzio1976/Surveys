import React from 'react';
import { withRouter, Link } from 'react-router-dom'
import { AuthContext } from '../App'

function Nav(props) {
    return (
        <AuthContext.Consumer>
            {
                ({ isAuth, logout }) => {
                    return (
                        <nav className="main-nav">
                            <div className="main-nav-left">
                                <div className="main-nav-button" onClick={() => props.history.push("/")}>Home</div>
                                <div className="main-nav-button" onClick={() => props.history.push("/add-survey")}>Dodaj ankietę</div>
                            </div>
                            <div className="main-nav-right">
                                {
                                    isAuth ?
                                        <>
                                            <button className="main-nav-login-button button logout-button" onClick={() => props.history.push("/my-surveys")}>Moje sondaże</button>
                                            <button className="main-nav-login-button button logout-button" onClick={logout}>Wyloguj</button>
                                        </> :
                                        <>

                                            <button className="main-nav-login-button button login-button" onClick={() => props.history.push("/login")}>Login</button>
                                            <button className="main-nav-register-button button register-button" onClick={() => props.history.push("/register")}>Rejestracja</button>
                                        </>
                                }
                            </div>

                        </nav>

                    )
                }
            }
        </AuthContext.Consumer>
    )
}
export default withRouter(Nav)