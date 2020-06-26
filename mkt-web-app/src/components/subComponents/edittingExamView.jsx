import React, { Component } from 'react';
import NetworkUtils from '../../utilities/networkUtilities';
import StringUtils from '../../utilities/stringUtilities';
import { createBrowserHistory as createHistory } from 'history';
import * as commonExamFunctions from './examElement';
import  { QuestionSearchBar } from './questionSearchBar';
import { questionSearchFilter } from '../../utilities/searchBarFunctionalityUtility';

class ExamEditView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            examObject: props.examObject,
            isLoading: true,
            errors: null,
            displayQuestions: [],
            questionSearchTerms: {
                name: '',
                type: '',
                subject: '',
                course: '',
            }
        }
    }

    componentDidMount() {
        commonExamFunctions.loadQuestions(this.state.examObject, 
            (questionsNotInExam) => {
            this.setState({
                questions: questionsNotInExam,
                displayQuestions: questionsNotInExam,
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
            displayQuestions: updatedQuestionsList,
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
            displayQuestions: [
                ...this.state.questions,
                questionObject
            ],
            examObject: {
                ...this.state.examObject,
                questions: updatedExamQuestions
            }
        });
    }

    searchForQuestion = (e) => {
        this.setState({
            questionSearchTerms: {
                ...this.state.questionSearchTerms,
                [e.target.name]: e.target.value
            } 
        });
        
        const newQuestionsList = questionSearchFilter(
                this.state.questions,
                this.state.questionSearchTerms.name,
                this.state.questionSearchTerms.subject,
                this.state.questionSearchTerms.type,
                this.state.questionSearchTerms.course                        
            );
        
        this.setState({
            displayQuestions: newQuestionsList
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
                <h1>Question Bank</h1>
                {QuestionSearchBar(this.searchForQuestion)}
                <div className='question-section'>
                    {this.state.isLoading ? (
                        <h3>Loading Questions...</h3>                
                    ) : (
                        commonExamFunctions.renderQuestions(
                            this.state.displayQuestions,
                            this.addQuestionSetStateCallback
                        )
                    )}
                </div>   
            </div>
        );
    }
}

export default ExamEditView;
