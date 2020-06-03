import React from 'react';
import ExamSubComponent from './subComponents/examElement';
 
class ExamManagementPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            exams: [],
            currentExam: {
                questionIds: []
            },
            newExam: {
                questionIds: []
            },
            isLoading: true,
            errors: null,
            isEditting: false,
        };
        this.addQuestionToExam = this.addQuestionToExam.bind(this);
        this.generateExam = this.generateExam.bind(this);     
    }

    componentDidMount() {
        this.fetchQuestions();
        this.fetchExams();
    }

    addQuestionToExam(questionObject) {
        if (this.isEditting) {
            this.setState({
                currentExam: {
                    ...this.state.currentExam,
                    questionIds: [
                        ...this.state.questionIds,
                        questionObject.id
                    ]
                }
            });
        } else {
            this.setState({
                newExam: {
                    ...this.state.newExam,
                    questionIds: [
                        ...this.state.questionIds,
                        questionObject.id
                    ]
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
    
    render() {
        return (
            <div>
                <div className='exam-preview'>
                    {this.state.isEditting ? 
                        (
                            <div className='is-editting'>
                                <ExamSubComponent exam_object={this.state.currentExam} />
                            </div>
                        ) :
                        (   <div className='is-not-editting'>
                                <ExamSubComponent exam_object={this.state.newExam}/>
                                
                            </div>
                    )}
                </div>
                <div className='previous-exams'>
                    {!this.state.isLoading ? (
                        this.state.exams.map((exam_object) => {
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
                                    <button className="btn btn-secondary" onClick={() => { this.setState({ isEditting: false })}}> Cancel </button>
                                </div>
                            )
                        })
                    ) : (
                        <h3>Loading Exams...</h3>
                    )}
                </div>
                <div className='question-section'>
                    {!this.state.isLoading ? (
                        this.state.questions.map((questionObject) => {
                            const { id, name, points, question, solution } = questionObject;
                            return (
                                <div key={`${id}`}>
                                    <p>Name: {name}</p>
                                    <p>Points: {points}</p>
                                    <p>Question: {question}</p>
                                    <p>Solution: {solution}</p>
                                    <button className="btn btn-primary" type="submit" onClick={this.addQuestionToExam(questionObject)}>Add Question To Exam</button>
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