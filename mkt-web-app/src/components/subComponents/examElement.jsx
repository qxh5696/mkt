import React, { Component } from 'react';

class ExamSubComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            examObject: props.examObject,
            isEditting: props.isEditting 
        }
    }

    trackExamChange(event) {
        const col = event.target.id;
        const val = event.target.value;
        this.setState({
            examObject: { 
                ...this.state.examObject,
                [col]: val
             } 
        });
    }

    render() {
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
                                value={this.state.examObject.course}
                                onChange={this.trackExamChange} />
                        </div>
                        <label htmlFor='exam-subject' className='col-sm-1 col-form-label'>Subject:</label>
                        <div className='col-md-2 mb-3'>
                            <input 
                                type='text' 
                                className='form-control' 
                                id='exam-subject'
                                value={this.state.examObject.subject}
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
                                value={this.state.examObject.name} 
                                onChange={this.trackExamChange} />
                        </div>
                        <label htmlFor='points' className='col-sm-1 col-form-label'>Points</label>
                    </div>
                    <div className='exam-questions'>
                        <label htmlFor='questions'>Questions:</label>
                        {this.state.examObject.questions.map(
                            (question) => {
                                const {id, name, points, ques, solution} = question; 
                                return (
                                    <div key={`question-${id}`}>
                                        <p>Name: {name}</p>
                                        <p>Points: {points} </p>
                                        <p>Question: {ques}</p>
                                        <p>Solution: {solution}</p>
                                        <button className='btn btn-danger' 
                                                onClick={() => { console.log('removing quesion' + id); }}>
                                                    Remove Question</button>
                                    </div>
                                )
                            }
                            )}
                    </div>
                </form>
                {this.state.isEditting ? (<button className="btn btn-primary" onClick={() => {console.log('saving...')}}> Save </button>) 
                : (<button className="btn btn-primary" onClick={() => { console.log('generating....')}}> Generate Exam </button>)}
            </div>
            
        )
    }

}


export default ExamSubComponent;
