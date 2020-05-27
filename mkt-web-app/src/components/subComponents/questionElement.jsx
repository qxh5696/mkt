import React, { Component } from 'react';

class QuestionSubComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionObject: props.questionObject,
            isEditting: false,
        }
        this.trackQuestionChange = this.trackQuestionChange.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }

    trackQuestionChange(event) {
        const col = event.target.id;
        const val = event.target.value;
        this.setState({
            questionObject: { 
                ...this.state.questionObject,
                [col]: val
             } 
        });
    }

    updateQuestion() {
        fetch('/updateQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.questionObject)
        }).then((response) => {
            return response.json();
        });
        this.setState({
            isEditting: false
        });
    }

    deleteQuestion() {
        fetch('/deleteQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id : this.state.questionObject.id})
        }).then((response) => {
            return response.json();
        });
    }

    render() {
        const { id, name, points, question, solution } = this.state.questionObject;
        return (
            <div key={`question-${id}`}>
                {this.state.isEditting ? (
                <div>  
                    <form className='question-form'>
                        <div className='form-group row'>
                            <label htmlFor='course' className='col-sm-1 col-form-label'>Course:</label>
                            <div className='col-md-2 mb-3'>
                                <input 
                                type='text' 
                                className='form-control' 
                                id='course' 
                                value={this.state.questionObject.course}
                                onChange={this.trackQuestionChange}></input>
                            </div>
                            <label htmlFor='subject' className='col-sm-1 col-form-label'>Subject:</label>
                            <div className='col-md-2 mb-3'>
                                <input type='text' className='form-control' id='subject'
                                value={this.state.questionObject.subject}
                                onChange={this.trackQuestionChange}></input>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='question-name' className='col-sm-1 col-form-label'>Question Name:</label>
                            <div className='col-sm-2'>
                                <input type='text' className='form-control' id='question-name'
                                value={this.state.questionObject.name} onChange={this.trackQuestionChange}></input>
                            </div>
                            <label htmlFor='question-type' className='col-sm-1 col-form-label'>Question Type:</label>
                            <div className='col-sm-2'>
                                <input type='text' className='form-control' id='question-type' 
                                value={this.state.questionObject.type} onChange={this.trackQuestionChange}></input>
                            </div>
                            <label htmlFor='points' className='col-sm-1 col-form-label'>Points</label>
                            <div className='col-sm-1'>
                                <input type='text' className='form-control' id='points' 
                                value={this.state.questionObject.points} onChange={this.trackQuestionChange}></input>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='question'>Question:</label>
                            <div className='col-sm-4'>
                                <textarea className='form-control' id='question' rows='3' onChange={this.trackQuestionChange}
                                value={this.state.questionObject.question}
                                ></textarea>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='solution'>Solution:</label>
                            <div className='col-sm-4'>
                                <textarea className='form-control' id='solution' rows='3' onChange={this.trackQuestionChange}
                                value={this.state.questionObject.solution}></textarea>    
                            </div>
                        </div>
                    </form>
                    <button className="btn btn-primary" onClick={this.updateQuestion}>Update Question </button>
                    <button className="btn btn-secondary" onClick={() => { this.setState({ isEditting: false })}}> Cancel </button>
                </div>
                ) : (
                    <div>
                        <p>Name: {name}</p>
                        <p>Points: {points}</p>
                        <p>Question: {question}</p>
                        <p>Solution: {solution}</p>
                        <button className="btn btn-secondary" onClick={() => { this.setState({ isEditting: true })}}> Edit </button>
                        <button className="btn btn-danger" onClick={this.deleteQuestion}> Delete </button>
                    </div>
                ) }
                <hr/>
            </div>
        )        
    }

}

export default QuestionSubComponent;