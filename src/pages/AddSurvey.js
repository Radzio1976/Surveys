import React from "react";
import axios from "axios";
import { API_URL } from "../consts/API_URL";

class AddSurvey extends React.Component {
    state = {
        author: "",
        nameOfSurvey: "",
        ask: "",
        answer: "",
        questions: []
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        if (localStorage.getItem('email')) {
            axios.post(API_URL + "/surveys/", { user: localStorage.getItem('email'), author: this.state.author, name: this.state.nameOfSurvey, questions: this.state.questions }).then((response) => {
                console.log(response)
                this.props.history.push("/")
            })
        } else {
            this.setState({
                error: "Musisz być zalogowany"
            })
        }
    }

    addAsk = () => {
        const questions = this.state.questions
        questions.push({
            ask: this.state.ask,
            answers: [],
            index: this.state.questions.length
        })
        this.setState({
            questions
        })
    }

    addAnswer = (index) => {
        const questions = this.state.questions
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].index === index) {
                console.log(questions[i])
                questions[i].answers.push(this.state.answer)
            }
        }
        this.setState({
            questions
        })
    }

    render() {
        return (
            <div className="add-survey">
                <div className="add-survey-container">
                    <label className="form-label add-survey-label">Autor</label>
                    <br />
                    <input className="form-input add-survey-input" type="text" name="author" value={this.state.author} onChange={this.handleChange} placeholder="Autor" />
                    <br />
                    <label className="form-label add-survey-label">Nazwa sondy</label>
                    <br />
                    <input className="form-input add-survey-input" type="text" name="nameOfSurvey" value={this.state.nameOfSurvey} onChange={this.handleChange} placeholder="Nazwa sondy" />
                    <br />
                    <label className="form-label add-survey-label">Utwórz pytanie</label>
                    <br />
                    <input className="form-input add-survey-input" type="text" name="ask" value={this.state.ask} onChange={this.handleChange} placeholder="Utwórz pytanie" />
                    <br />
                    <button className="main-nav-login-button button" onClick={this.addAsk}>Dodaj pytanie</button>
                    {
                        this.state.questions.map((question, index) => {
                            return (
                                <>
                                    <div className="add-survey-question">Pytanie {index + 1}: {question.ask}</div>
                                    <label className="form-label add-survey-label">Utwórz odpowiedź</label>
                                    <input className="form-input add-survey-input" type="text" name="answer" value={this.state.answer} onChange={this.handleChange} placeholder="Utwórz odpowiedź" />
                                    <button className="main-nav-login-button button" onClick={() => this.addAnswer(index)}>Dodaj odpowiedź</button>
                                    {
                                        question.answers.map((answer, index) => {
                                            return (
                                                <div className="add-survey-answer">{index + 1}. {answer}</div>
                                            )
                                        })
                                    }
                                    <label className="form-label add-survey-label">Utwórz pytanie</label>
                                    <br />
                                    <input className="form-input add-survey-input" type="text" name="ask" value={this.state.ask} onChange={this.handleChange} placeholder="Utwórz pytanie" />
                                    <button className="main-nav-login-button button" onClick={this.addAsk}>Dodaj pytanie</button>
                                </>
                            )
                        })
                    }
                    <button className="main-nav-login-button button" onClick={this.handleSubmit}>Zatwierdź</button>
                    <h3>{this.state.error}</h3>
                </div>
            </div>
        )
    }
}

export default AddSurvey;