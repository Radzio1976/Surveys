import React from 'react';
import Axios from "axios";
import prettyURLConverter from '../utils/prettyURLConverter';
import { API_URL } from '../consts/API_URL';

class Home extends React.Component {
    state = {
        surveys: []
    }

    componentDidMount() {
        Axios.get(API_URL + "/surveys/").then((response) => {
            console.log(response)
            this.setState({
                surveys: response.data
            })
        })
    }

    goToPage = (page, obj = {}) => {
        this.props.history.push(page, obj)
    }

    render() {
        console.log(this.props)
        return (
            <>
                <section className="slider">
                    <div className="slider-container">
                        <article className="slider-left">
                            <h1 className="slider-title">Stwórz własny sondaż</h1>
                            <h3>Dzięki naszej stronie możesz zbadać opinię innych na interesujący Cię temat</h3>
                            <div className="button_cont" align="center"><a className="example_a" href="/add-survey" rel="nofollow noopener">Stwórz własną ankietę</a></div>
                        </article>
                        <div className="home-image">
                        </div>
                    </div>
                </section>
                <div className="home-main">
                    {this.state.surveys.map((value, index) => {
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

export default Home