import React, { Component } from 'react';
import NetworkUtils from '../../utilities/networkUtilities';
import StringUtils from '../../utilities/stringUtilities';
import { createBrowserHistory as createHistory } from 'history';
import * as commonExamFunctions from './examElement';

class ExamEditView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            examObject: props.examObject,
            isLoading: true,
            errors: null,
        }
    }

    componentDidMount() {
        commonExamFunctions.loadQuestions(this.state.examObject, 
            (questionsNotInExam) => {
            this.setState({
                questions: questionsNotInExam,
                isLoading: false,
            });
        });    
    }
    
    trackExamChange = (event) => {
        const col = StringUtils.convertIdToJSONKey(event.target.id);
        const val = event.target.value;
        this.setState({
            examObject: {
                ...this.state.examObject,
                [col]: val
            }
        });
    }

    addQuestionSetStateCallback = (updatedQuestionsList, questionObject) => {
        this.setState({
            questions: updatedQuestionsList,
            examObject: {
                ...this.state.examObject,
                questions: [
                    ...this.state.examObject.questions,
                    questionObject
                ]
            }
        });
    }

    removeQuestionSetStateCallBack = (updatedExamQuestions, questionObject) => {
        this.setState({
            questions: [
                ...this.state.questions,
                questionObject
            ],
            examObject: {
                ...this.state.examObject,
                questions: updatedExamQuestions
            }
        });
    }

    // Unique functions

    saveExam() {
        NetworkUtils.commonPost('/updateExam', this.state.examObject);
        createHistory().go(0);
    }

    render() {
        return (
            <div>
                <div className='exam-section'>
                    {this.state.isLoading ? (
                        <h3>Loading Exam...</h3>
                    ) : (
                        commonExamFunctions.renderExamForm(
                            this.state.examObject,
                            this.trackExamChange,
                            this.removeQuestionSetStateCallBack
                        )
                    )}
                    <div className="btn btn-primary" onClick={() => {this.saveExam()}}> Save </div>
                    <button className="btn btn-secondary" onClick={() => { createHistory().go(0); }}> Cancel </button>
                </div>
                <div className='question-section'>
                    {this.state.isLoading ? (
                        <h3>Loading Questions...</h3>                
                    ) : (
                        commonExamFunctions.renderQuestions(
                            this.state.questions,
                            this.addQuestionSetStateCallback
                        )
                    )}
                </div>   
            </div>
        );
    }
}

export default ExamEditView;
