import React from "react";
import { withRouter, Link } from 'react-router-dom'
import { AuthContext } from '../App';
import Axios from "axios";
import CanvasJS from '../canvasjs.react'
const CJS = CanvasJS.CanvasJS
const CJSChart = CanvasJS.CanvasJSChart;


class Survey extends React.Component {
    state = {
        author: "",
        name: "",
        questions: [],
        statistics: [],
        chartType: "column"
    }

    componentDidMount() {
        Axios.get("http://localhost:3000/surveys/" + this.props.location.state.id).then((response) => {
            Axios.get(`http://localhost:3000/answers?surveyId=${this.props.location.state.id}`).then((response2) => {
                for (let i = 0; i < response.data.questions.length; i++) {
                    let sum = 0
                    const statData = []
                    for (let k = 0; k < response2.data.length; k++) {
                        let isInside = false
                        console.log(response.data.questions[i], response2.data[k].answers[i])
                        for (let m = 0; m < statData.length; m++) {
                            if (statData[m].label === response2.data[k].answers[i]) {
                                statData[m].count++
                                isInside = true
                                sum++
                            }
                        }
                        if (!isInside) {
                            statData.push({
                                count: 1,
                                label: response2.data[k].answers[i]
                            })
                            sum++
                        }
                    }
                    for (let k = 0; k < statData.length; k++) {
                        statData[k].y = statData[k].count / sum * 100
                    }
                    response.data.questions[i].statistics = statData
                }

                this.setState({
                    author: response.data.author,
                    name: response.data.name,
                    questions: response.data.questions
                })

                // const distinctQuestion = []
                // for (let i = 0; i < response2.data.length; i++) {
                //     let isInside = false
                //     for (let m = 0; m < response2.data[i].answers.length; m++) {
                //         console.log(response2.data[i].answers[m])
                //         console.log(response.data.questions[m])
                //     }

                // }
            })
        })
    }

    addAnswer = (event) => {
        event.preventDefault()
        const questions = this.state.questions
        const answers = []
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].userChecked) {
                answers.push(questions[i].userChecked)
            } else {
                answers.push(questions[i].answers[0])
            }
        }
        Axios.post("http://localhost:3000/answers/", { answers, surveyId: this.props.location.state.id }).then((response) => {
            this.props.history.replace("/")
        })
    }

    onChange = (event) => {
        const questions = this.state.questions
        for (let i = 0; i < questions.length; i++) {
            if (event.target.name == i) {
                questions[i].userChecked = event.target.value
            }
        }
        this.setState({
            questions
        })
    }

    changeChartType = () => {
        this.setState({
            chartType: "pie"
        })
        if (this.state.chartType === "pie") {
            this.setState({
                chartType: "column"
            })
        }
    }

    removeSurvey = () => {
        Axios.get("http://localhost:3000/surveys/" + this.props.location.state.id).then((response) => {
            if (response.data.user === localStorage.getItem('email')) {
                Axios.delete("http://localhost:3000/surveys/" + this.props.location.state.id).then((response2) => {
                    console.log(this.props.location.state.id)
                    this.props.history.push("/")
                })
            } else {
                this.setState({
                    error: "Nie możesz usunąć tej sondy, bo nie należy do Ciebie"
                })
            }
        })

    }

    render() {
        return (
            <AuthContext.Consumer>
                {
                    ({ isAuth, currentUser }) => {
                        return (
                            <div className="survey-main">
                                <h1>{this.state.author}</h1>
                                <h2>{this.state.name}</h2>
                                <button className="main-nav-login-button button chart-type-button" style={{ position: "absolute", top: "202px", right: "0px" }} onClick={this.changeChartType} >{this.state.chartType === "column" ? "Wykres kołowy" : "Wykres słupkowy"}</button>
                                <form onSubmit={this.addAnswer}>
                                    {this.state.questions.map((question, questionID) => {
                                        const dataPoints = []
                                        let sum = 0
                                        for (let i = 0; i < question.answers.length; i++) {

                                        }
                                        return (
                                            <React.Fragment key={questionID}>
                                                <h3 style={{ color: "white", marginTop: "5px", marginBottom: "5px" }}>{question.ask}</h3>
                                                {
                                                    question.answers.map((answer, index) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <input style={{ display: "block" }} type="radio" onChange={this.onChange} value={answer} name={questionID} defaultChecked={index === 0 ? true : false}></input>
                                                                <label style={{ color: "white" }}>{answer}</label>
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                                <button className="main-nav-login-button button chart-button" style={{ display: "block" }}>Zatwierdź</button>
                                                <CJSChart options={
                                                    {
                                                        exportEnabled: true,
                                                        animationEnabled: true,

                                                        title: {
                                                            text: question.ask
                                                        },
                                                        data: [
                                                            {
                                                                indexLabel: "{label} - {y}%",
                                                                startAngle: -90,
                                                                type: this.state.chartType,
                                                                dataPoints: question.statistics
                                                            }
                                                        ]
                                                    }
                                                }
                                                />
                                            </React.Fragment>
                                        )
                                    })}
                                </form>
                                {
                                    isAuth ?
                                        <>
                                            <button className="main-nav-login-button button remove-chart-button" onClick={this.removeSurvey} >Usuń sondę</button>
                                        </> : ""
                                }
                                <h3>{this.state.error}</h3>
                            </div>
                        )
                    }
                }
            </AuthContext.Consumer>
        )
    }
}

export default Survey