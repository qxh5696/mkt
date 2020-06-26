import React, { Component } from 'react';
import QuestionSubComponent from './subComponents/questionElement';
import NetworkUtils from '../utilities/networkUtilities';
import '../assets/scss/questionManagementPage.css';
import  { QuestionSearchBar } from './subComponents/questionSearchBar';
import { questionSearchFilter } from '../utilities/searchBarFunctionalityUtility';


class QuestionManagementPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            isLoading: true,
            newQuestion: {},
            errors: null,
            displayQuestions: [],
            questionSearchTerms: {
                name: '',
                type: '',
                subject: '',
                course: '',
            }
        };
        this.addQuestion = this.addQuestion.bind(this);
        this.updateNewQuestion = this.updateNewQuestion.bind(this);    
    }
    
    componentDidMount() {
        NetworkUtils.commonGet('/questions', (data) => {
            this.setState({
                questions: data['questions'],
                displayQuestions: data['questions'],
                isLoading: false,
            });
        });
    }

    addQuestion() {
        NetworkUtils.commonPost('/addQuestion', this.state.newQuestion);
    }

    updateNewQuestion(event) {
        const col = event.target.id;
        const val = event.target.value;
        this.setState({
            newQuestion: { 
                ...this.state.newQuestion,
                [col]: val
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

    render() {
        const { displayQuestions, isLoading, error } = this.state;
        return (
            <div className='container'>
                <h1>Question Form</h1>
                <form className='question-form'>
                    <div className='form-group row'>
                        <label htmlFor='course' className='col-sm-1 col-form-label'>Course:</label>
                        <div className='col-md-4 mb-3'>
                            <input type='text' className='form-control' id='course' placeholder='Ex. Introduction To Algorithms' 
                            onChange={this.updateNewQuestion}></input>
                        </div>
                        <label htmlFor='subject' className='col-sm-1 col-form-label'>Subject:</label>
                        <div className='col-md-4 mb-3'>
                            <input type='text' className='form-control' id='subject' placeholder='Ex. Computer Science'
                            onChange={this.updateNewQuestion}></input>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <label htmlFor='question-name' className='col-sm-1 col-form-label'>Question Name:</label>
                        <div className='col-sm-3'>
                            <input type='text' className='form-control' id='question-name' placeholder='Ex. Binary Search'
                            onChange={this.updateNewQuestion}></input>
                        </div>
                        <label htmlFor='question-type' className='col-sm-1 col-form-label'>Question Type:</label>
                        <div className='col-sm-3'>
                            <input type='text' className='form-control' id='question-type' placeholder='Ex. Short Answer'
                            onChange={this.updateNewQuestion}></input>
                        </div>
                        <label htmlFor='points' className='col-sm-1 col-form-label'>Points</label>
                        <div className='col-sm-1'>
                            <input type='text' className='form-control' id='points' placeholder='15'
                            onChange={this.updateNewQuestion}></input>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='question'>Question:</label>
                        <div className='col-sm-7'>
                            <textarea className='form-control' id='question' rows='3' onChange={this.updateNewQuestion}></textarea>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='solution'>Solution:</label>
                        <div className='col-sm-5'>
                            <textarea className='form-control' id='solution' rows='3' onChange={this.updateNewQuestion}></textarea>    
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit" onClick={this.addQuestion}>Add Question </button>
                </form>
                {error ? <p>{error.message}</p> : null}
                <h1>Question Bank</h1>
                {QuestionSearchBar(this.searchForQuestion)}
                <div className='question-section'>
                    {!isLoading ? (
                        displayQuestions.map(question_object => {
                            return <QuestionSubComponent questionObject={question_object} key={`question-${question_object._id['$oid']}`} />
                        })
                    ) : (
                        <h3>Loading Questions...</h3>
                    )}
                </div> 
            </div>
            );
    }
    
}
 
export default QuestionManagementPage;