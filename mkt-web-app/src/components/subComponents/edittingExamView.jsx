import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import NetworkUtils from '../../utilities/networkUtilities';
import StringUtils from '../../utilities/stringUtilities';
import {arraySubtraction}  from '../../utilities/arrayUtilities';
import { createBrowserHistory as createHistory } from 'history'

class ExamEditView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            examObject: props.examObject,
            isLoading: true,
        }
        this.trackExamChange = this.trackExamChange.bind(this);
    }

    componentDidMount() {
        this.loadQuestions();    
    }

    trackExamChange(event) {
        const col = StringUtils.convertIdToJSONKey(event.target.id);
        const val = event.target.value;
        this.setState({
            examObject: {
                ...this.state.examObject,
                [col]: val
            }
        });
    }

    addQuestionToExam(questionObject) {
        let updatedQuestions = this.state.questions.filter(question => question._id['$oid'] !== questionObject._id['$oid'])
        this.setState({
            questions: updatedQuestions,
            examObject: {
                ...this.state.examObject,
                questions: [
                    ...this.state.examObject.questions,
                    questionObject
                ]
            }
        });
    }

    removeQuestionFromExam(questionObject) {
        const updatedExamQuestions = this.state.examObject.questions.filter(question => question._id['$oid'] !== questionObject._id['$oid']);
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

    loadQuestions() {
        NetworkUtils.commonGet('/questions', (data) => {
            const questionsNotInExam = arraySubtraction(data['questions'], this.state.examObject.questions);
            this.setState({
                questions: questionsNotInExam,
                isLoading: false,
            });
        });
    }

    renderQuestions() {
        return (
            <div>
                <h1>Questions: </h1>
                {this.state.questions.map((questionObject) => {
                    const { _id, name, points, question, solution } = questionObject;
                    return (
                        <div key={`${_id['$oid']}`}>
                            <p>Name: {name}</p>
                            <p>Points: {points}</p>
                            <p>Question: {question}</p>
                            <p>Solution: {solution}</p>
                            <button className="btn btn-primary" type="submit" onClick={() => { this.addQuestionToExam(questionObject); }}>Add Question To Exam</button>
                        </div>
                    );
                })};
            </div>
        );
    }

    saveExam() {
        NetworkUtils.commonPost('/updateExam', this.state.examObject);
        createHistory().go(0);
    }

    renderExamObject() {
        return (
            <div>
                <form className='exam-form'>
                    <div className='form-group row'>
                        <label htmlFor='course' className='col-sm-1 col-form-label'>Course:</label>
                        <div className='col-md-2 mb-3'>
                            <input 
                                type='text'
                                className='form-control' 
                                id='exam-course' 
                                defaultValue={this.state.examObject.examCourse}
                                onChange={this.trackExamChange} />
                        </div>
                        <label htmlFor='exam-subject' className='col-sm-1 col-form-label'>Subject:</label>
                        <div className='col-md-2 mb-3'>
                            <input 
                                type='text' 
                                className='form-control' 
                                id='exam-subject'
                                defaultValue={this.state.examObject.examSubject}
                                onChange={this.trackExamChange} />
                        </div>
                    </div>
                    <div className='form-group row'>
                        <label htmlFor='exam-name' className='col-sm-1 col-form-label'>Exam Name:</label>
                        <div className='col-sm-2'>
                            <input 
                                type='text' 
                                className='form-control' 
                                id='exam-name'
                                defaultValue={this.state.examObject.examName} 
                                onChange={this.trackExamChange} />
                        </div>
                    </div>
                    <div className='exam-questions'>
                        <label htmlFor='questions'>Questions:</label>
                        {this.state.examObject.questions.map(
                            (question, idx) => {
                                const {name, points, ques, solution} = question; 
                                return (
                                    <div key={`question-${idx}`}>
                                        <p>Name: {name}</p>
                                        <p>Points: {points} </p>
                                        <p>Question: {ques}</p>
                                        <p>Solution: {solution}</p>
                                        <div className='btn btn-danger' 
                                                onClick={() => {this.removeQuestionFromExam(question)}}>
                                                    Remove Question</div>
                                    </div>
                                )
                            }
                            )}
                    </div>
                    <div>
                        <div className="btn btn-primary" onClick={() => {this.saveExam()}}> Save </div>
                        <button className="btn btn-secondary" onClick={() => { return <Redirect to='/examManagement'/> }}> Cancel </button>
                    </div>
                </form>
            </div>
        );
    }

    editExamView() {
        return (
            <div>
                <div className='exam-section'>
                    {this.state.isLoading ? (
                        <h3>Loading Exams...</h3>
                    ) : (
                        this.renderExamObject()
                    )}
                </div>
                <div className='question-section'>
                    {this.state.isLoading ? (
                        <h3>Loading Questions...</h3>                
                    ) : (
                        this.renderQuestions()
                    )}
                </div>   
            </div>);
    }

    render() {
        return this.editExamView();
    }
}

export default ExamEditView;
