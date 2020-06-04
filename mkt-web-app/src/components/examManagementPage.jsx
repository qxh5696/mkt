import React from 'react';
import StringUtils from '../utilities/stringUtilities';
 
class ExamManagementPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            exams: [],
            currentExam: {},
            newExam: {
                questions: []
            },
            isLoading: true,
            errors: null,
            isEditting: false,
        };
        this.generateExam = this.generateExam.bind(this);     
        this.trackExamChange = this.trackExamChange.bind(this);
        this.examPreview = this.examPreview.bind(this);
    }

    componentDidMount() {
        this.fetchQuestions();
        this.fetchExams();
    }

    addQuestionToExam(questionObject) {
        let updatedQuestions = this.state.questions.filter(question => question.id != questionObject.id)
        if (this.state.isEditting) {
            this.setState({
                questions: updatedQuestions,
                currentExam: {
                    ...this.state.currentExam,
                    questions: [
                        ...this.state.currentExam.questions,
                        questionObject
                    ]
                }
            });
        } else {
            this.setState({
                questions: updatedQuestions,
                newExam: {
                    ...this.state.newExam,
                    questions: [
                        ...this.state.newExam.questions,
                        questionObject
                    ]
                }
            });
        }
    }

    removeQuestionFromExam(questionObject) {
        if (this.state.isEditting) {
            let updatedExamQuestions = this.state.currentExam.questions.filter(question => question.id != questionObject.id);
            this.setState({
                questions: [
                    ...this.state.questions,
                    questionObject
                ],
                currentExam: {
                    ...this.state.currentExam,
                    questions: updatedExamQuestions
                }
            });
        } else {
            let updatedExamQuestions = this.state.newExam.questions.filter(question => question.id != questionObject.id);
            this.setState({
                questions: [
                    ...this.state.questions,
                    questionObject
                ],
                newExam: {
                    ...this.state.newExam,
                    questions: updatedExamQuestions
                }
            });
        }
    }

    generateExam() {
        fetch('/addExam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.newExam)
        })
        .then(response => response.json());
    }

    fetchQuestions() {
        fetch('/questions')
        .then(response => response.json())
        .then(data =>
            this.setState({
                questions: data['questions'],
                isLoading: false,
            })
        )
        .catch(error => this.setState({ error, isLoading: false }));
    }

    fetchExams() {
        fetch('/exams')
        .then(response => response.json())
        .then(data => 
                this.setState({
                    exams: data['exams']
                })
        )
        .catch(error => this.setState({ error, isLoading: false }));
    }

    fetchExam(exam_object) {
        fetch('/exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'id': exam_object.id})
        })
        .then(response => response.json());
    }

    trackExamChange(event) {
        const col = StringUtils.convertIdToJSONKey(event.target.id);
        const val = event.target.value;
        if (this.state.isEditting) {
            this.setState({
                currentExam: {
                    ...this.state.currentExam,
                    [col]: val
                }
            });
        } else {
            this.setState({
                newExam: {
                    ...this.state.newExam,
                    [col]: val
                }
            });
        }
    }

    examPreview(exam) {
        // Only show the items in the list 
        let questionIDSet = Set()
        for (var i = 0; i < exam.questions.length; i++ ){
            questionIDSet.add(exam.questions[i].id);
        }
        let newQuestionsList = this.state.questions.filter(question => !questionIDSet.has(question.id));
        this.setState({
            questions: newQuestionsList
        });
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
                                defaultValue={exam.examCourse}
                                onChange={this.trackExamChange} />
                        </div>
                        <label htmlFor='exam-subject' className='col-sm-1 col-form-label'>Subject:</label>
                        <div className='col-md-2 mb-3'>
                            <input 
                                type='text' 
                                className='form-control' 
                                id='exam-subject'
                                defaultValue={exam.examSubject}
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
                                defaultValue={exam.name} 
                                onChange={this.trackExamChange} />
                        </div>
                    </div>
                    <div className='exam-questions'>
                        <label htmlFor='questions'>Questions:</label>
                        {exam.questions.map(
                            (question, idx) => {
                                const {id, name, points, ques, solution} = question; 
                                return (
                                    <div key={`question-${idx}`}>
                                        <p>Name: {name}</p>
                                        <p>Points: {points} </p>
                                        <p>Question: {ques}</p>
                                        <p>Solution: {solution}</p>
                                        <button className='btn btn-danger' onClick={() => {
                                            this.removeQuestionFromExam(question);
                                        }}>
                                                    Remove Question</button>
                                    </div>
                                )
                            }
                            )}
                    </div>
                </form>
                {this.state.isEditting ? (<button className="btn btn-primary"> Save </button>) 
                : (<button className="btn btn-primary"> Generate Exam </button>)}
            </div>
        )
    }
    
    render() {
        return (
            <div>
                <div className='exam-preview'>
                    {!this.state.isEditting ? this.examPreview(this.state.newExam) : this.examPreview(this.state.currentExam)}
                </div>
                <div className='previous-exams'>
                    {!this.state.isLoading ? (
                        this.state.exams.length == 0 ?
                         (<div> No Exams to Display </div>) : 
                         (this.state.exams.map((exam_object) => {
                            const { id, name, points, course, subject } = exam_object; 
                            return (
                                <div class='exam-entry' key={`${id}`}>
                                    <div>Exam name: {name}</div>
                                    <div>Course: {course} </div>
                                    <div>Subject: {subject}</div>
                                    <div>Points: {points}</div>
                                    <button className="btn btn-primary" onClick={() => { 
                                        this.setState({ 
                                            isEditting: true,
                                            currentExam: exam_object
                                         });
                                        }}> Edit Exam</button>
                                    <button className="btn btn-secondary"> Cancel </button>
                                </div>
                            )
                        }))                        
                    ) : (
                        <h3>Loading Exams...</h3>
                    )}
                </div>
                <div className='question-section'>
                    {!this.state.isLoading ? (
                        this.state.questions.map((questionObject) => {
                            const { id, name, points, question, solution } = questionObject;
                            return (
                                <div key={`${id}`} style={'display: none'}>
                                    <p>Name: {name}</p>
                                    <p>Points: {points}</p>
                                    <p>Question: {question}</p>
                                    <p>Solution: {solution}</p>
                                    <button className="btn btn-primary" type="submit" onClick={() => { this.addQuestionToExam(questionObject); }}>Add Question To Exam</button>
                                </div>
                            )
                        })
                    ) : (
                        <h3>Loading Questions...</h3>
                    )}
                </div> 
            </div>
         )
    }
}
 
export default ExamManagementPage;