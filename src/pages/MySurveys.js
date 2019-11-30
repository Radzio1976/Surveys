import React from 'react';
import Axios from "axios";
import prettyURLConverter from '../utils/prettyURLConverter';
import { AuthContext } from '../App'
import { Redirect } from 'react-router-dom'

class MySurveys extends React.Component {
    state = {
        mySurveys: []
    }

    componentDidMount() {
        const mySurveys = this.state.mySurveys
        Axios.get("http://localhost:3000/surveys").then((response) => {
            console.log(response.data)
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].user === localStorage.getItem('email')) {
                    mySurveys.push(response.data[i])
                }
            }
            this.setState({
                mySurveys
            })
        })
    }

    goToPage = (page, obj = {}) => {
        this.props.history.push(page, obj)
    }

    render() {
        return (
            <AuthContext.Consumer>
                {
                    ({ isAuth, currentUser }) => {
                        return (
                            <>
                                <div className="home-main">
                                    {
                                        isAuth ?
                                            <>
                                                {this.state.mySurveys.map((value, index) => {
                                                    console.log(value.id)
                                                    return (
                                                        <div key={index} className="home-main-container">
                                                            <div className="home-main-survey-left" key={index}>
                                                                <h1>{value.name}</h1>
                                                                <h2>Autor {value.author}</h2>
                                                                <button className="main-nav-login-button button" onClick={() => this.goToPage("/survey/" + prettyURLConverter(value.name), { id: value.id })}>Wybierz</button>
                                                            </div>
                                                            <div className="home-main-survey-right" style={{ backgroundColor: index % 2 !== 0 ? "#00bf6f" : "aqua" }}></div>
                                                        </div>
                                                    )
                                                })}
                                            </> :
                                            <Redirect to="/" />
                                    }

                                </div>
                                <footer>
                                    <div className="footer-container">
                                        <div className="footer-container-left">
                                            <p>Designed by Radosław Tomaszewski</p>
                                        </div>
                                        <div className="footer-container-right">
                                        </div>
                                    </div>
                                </footer>
                            </>
                        )
                    }
                }
            </AuthContext.Consumer>
        )
    }
}

export default MySurveys;