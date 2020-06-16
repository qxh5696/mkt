import React, { Component } from 'react';
import QuestionSubComponent from './subComponents/questionElement';
import NetworkUtils from '../utilities/networkUtilities';


class QuestionManagementPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            isLoading: true,
            newQuestion: {},
            errors: null
        };
        this.addQuestion = this.addQuestion.bind(this);
        this.updateNewQuestion = this.updateNewQuestion.bind(this);    
    }
    
    componentDidMount() {
        NetworkUtils.commonGet('/questions', (data) => {
            this.setState({
                questions: data['questions'],
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

    render() {
        const { questions, isLoading, error } = this.state;
        return (
            <div>
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
                <hr/>
                {error ? <p>{error.message}</p> : null}
                <div className='question-section'>
                    {!isLoading ? (
                        questions.map(question_object => {
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