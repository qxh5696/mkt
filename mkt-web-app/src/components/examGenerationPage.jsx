import React from 'react';
import NetworkUtils from '../utilities/networkUtilities';
import StringUtils from '../utilities/stringUtilities';
import { arraySubtraction }  from '../utilities/arrayUtilities';
 
class ExamGenerationPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            isLoading: false,
            examObject: {
                questions: []
            },
            errors: null, 
        }
    }

    componentDidMount() {
        this.loadQuestions();    
    }

    loadQuestions() {
        NetworkUtils.commonGet('/questions', (data) => {
            const questionsNotInExam = arraySubtraction(data['questions'], this.state.examObject.questions);
            this.setState({
                questions: questionsNotInExam
            })
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
    

    renderQuestions() {
        return (
            this.state.questions.map((questionObject) => {
                const { _id, name, points, question, solution } = questionObject;
                return (
                    <div key={`${_id['$oid']}`}>
                        <p>Name: {name}</p>
                        <p>Points: {points}</p>
                        <p>Question: {question}</p>
                        <p>Solution: {solution}</p>
                        <button className="btn btn-primary" type="submit" onClick={() => { this.addQuestionToExam(questionObject); }}>Add Question To Exam</button>
                    </div>
                )
            })
        );
    }

    renderNewExamForm() {
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
                                onChange={this.trackExamChange} />
                        </div>
                        <label htmlFor='exam-subject' className='col-sm-1 col-form-label'>Subject:</label>
                        <div className='col-md-2 mb-3'>
                            <input 
                                type='text' 
                                className='form-control' 
                                id='exam-subject'
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
                    <button className="btn btn-primary" onClick={() => {this.generateExam()}}> Generate Exam </button>
                </form>
            </div>
        );
    }

    // Unique functions

    generateExam() {
        NetworkUtils.commonPost('/addExam', this.state.examObject);
        this.setState({
            examObject: {
                questions: []
            }
        })
        this.loadQuestions();
    }

    render() {
        return (
            <div>
                <div className='exam-section'>
                    {this.renderNewExamForm()}
                </div>
                <div className='question-section'>
                    {!this.state.isLoading ? (
                        this.renderQuestions()
                    ) : (
                        <h3>Loading Questions...</h3>
                    )}
                </div>   
            </div>
        );
    }
    
}
 
export default ExamGenerationPage;