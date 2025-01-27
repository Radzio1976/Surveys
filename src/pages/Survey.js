import React from "react";
import { withRouter, Link } from 'react-router-dom'
import { API_URL } from '../consts/API_URL'
import { AuthContext } from '../App';
import Axios from "axios";
import getUserIP from '../utils/getUserIP';
import CanvasJS from '../canvasjs.react'
const CJS = CanvasJS.CanvasJS
const CJSChart = CanvasJS.CanvasJSChart;



class Survey extends React.Component {
    state = {
        author: "",
        name: "",
        questions: [],
        statistics: [],
        chartType: "column",
        currentIP: "",
        isJoined: false
    }

    componentDidMount() {
        Axios.get(API_URL + "/surveys/" + this.props.location.state.id).then((response) => {
            Axios.get(`${API_URL}/answers?surveyId=${this.props.location.state.id}`).then((response2) => {
                for (let i = 0; i < response.data.questions.length; i++) {
                    let sum = 0
                    const statData = []
                    for (let k = 0; k < response2.data.length; k++) {
                        let isInside = false
                        //   console.log(response.data.questions[i], response2.data[k].answers[i])
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
            })
        })
        Axios.get("https://api.ipfind.com/me?auth=58039b89-f1d6-4800-a99f-071faf4878e4").then((response3) => {
            this.setState({
                currentIP: response3.data.ip_address
            })
            Axios.get(`${API_URL}/ipAddresses?surveyId=${this.props.location.state.id}`).then((response4) => {
                console.log(response4.data)
                console.log(this.state.currentIP)
                if (response4.data.length === 0) {
                    this.setState({
                        isJoined: false
                    })
                    return
                }
                if (response4.data[0].ipAddress === response3.data.ip_address) {
                    this.setState({
                        isJoined: true
                    })
                }
            })
        }).catch((err) => {
            console.log(err)
        })

        console.log(this.state.isJoined)
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

        if (this.state.isJoined === false) {
            Axios.post(API_URL + "/answers/", { answers, surveyId: this.props.location.state.id }).then((response) => {
                console.log(response)
                Axios.post(API_URL + "/ipAddresses/", { ipAddress: this.state.currentIP, surveyId: this.props.location.state.id }).then((response2) => {
                    console.log(response2)
                    //this.props.history.push("/")
                })
            })
            console.log(this.props.location.state.id)
            console.log(this.state.isJoined)
        } else {
            this.setState({
                error: "Oddałeś już głos w tej sondzie"
            })
        }

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
        Axios.get(API_URL + "/surveys/" + this.props.location.state.id).then((response) => {
            if (response.data.user === localStorage.getItem('email')) {
                Axios.delete(API_URL + "/surveys/" + this.props.location.state.id).then((response2) => {
                    console.log(this.props.location.state.id)
                    this.props.history.push("/")
                })
            } else {
                alert("Nie możesz usunąć tej sondy, bo nie należy do Ciebie")
            }
        })

    }

    render() {
        return (
            <AuthContext.Consumer >
                {
                    ({ isAuth }) => {
                        return (
                            <div className="survey-main" >
                                <h1>{this.state.author}</h1>
                                <h2>{this.state.name}</h2>
                                <button className="main-nav-login-button button chart-type-button" style={{ position: "absolute", top: "168px", right: "0px" }} onClick={this.changeChartType} >{this.state.chartType === "column" ? "Wykres kołowy" : "Wykres słupkowy"}</button>
                                <form onSubmit={this.addAnswer}>
                                    {this.state.questions.map((question, questionID) => {
                                        // const dataPoints = []
                                        // let sum = 0
                                        //  for (let i = 0; i < question.answers.length; i++) {

                                        // }
                                        return (
                                            <React.Fragment key={questionID}>
                                                <h3 style={{ color: "white", marginTop: "10px", marginBottom: "10px" }}>{question.ask}</h3>
                                                {
                                                    question.answers.map((answer, index) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <label className="survey-answer-container">{answer}
                                                                    <input style={{ display: "block" }} type="radio" onChange={this.onChange} value={answer} name={questionID} defaultChecked={index === 0 ? true : false}></input>
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                                <button className="main-nav-login-button button chart-button" style={{ display: this.state.questions.length - 1 === questionID ? "block" : "none", position: "absolute", bottom: "-80px", left: "0px" }}>Zatwierdź</button>
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
                                            <button className="main-nav-login-button button remove-chart-button" style={{ position: "absolute", bottom: "-55px", right: "0px" }} onClick={this.removeSurvey} >Usuń sondę</button>
                                        </> : ""
                                }
                                <h3>{this.state.error}</h3>
                            </div >
                        )
                    }
                }
            </AuthContext.Consumer >
        )
    }
}

export default Survey