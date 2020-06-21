import React from 'react';
import NetworkUtils from '../utilities/networkUtilities';
import StringUtils from '../utilities/stringUtilities';
import * as commonExamFunctions from '../components/subComponents/examElement';
import { createBrowserHistory as createHistory } from 'history';
 
class ExamGenerationPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            isLoading: false,
            examObject: {
                examName: "",
                examCourse: "",
                examSubject: "",
                questions: []
            },
            errors: null, 
        }
    }

    componentDidMount() {
        commonExamFunctions.loadQuestions(this.state.examObject, 
            (questionsNotInExam) => {
            this.setState({
                questions: questionsNotInExam
            });
        });
    }
    
    // Unique functions

    generateExam() {
        NetworkUtils.commonPost('/addExam', this.state.examObject);
        this.setState({
            examObject: {
                examName: "",
                examCourse: "",
                examSubject: "",
                questions: []
            }
        });
        commonExamFunctions.loadQuestions(this.state.examObject, 
            (questionsNotInExam) => {
            this.setState({
                questions: questionsNotInExam
            });
        });
        createHistory().go(0);
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

    render() {
        return (
            <div>
                <div className='exam-section'>
                    {commonExamFunctions.renderExamForm(
                        this.state.examObject,
                        this.trackExamChange,
                        this.removeQuestionSetStateCallBack
                    )}    
                    <button className="btn btn-primary" onClick={() => {this.generateExam()}}> Generate Exam </button>
                </div>
                <div className='question-section'>
                    {!this.state.isLoading ? (
                        commonExamFunctions.renderQuestions(
                            this.state.questions,
                            this.addQuestionSetStateCallback
                        )
                    ) : (
                        <h3>Loading Questions...</h3>
                    )}
                </div>   
            </div>
        );
    }
    
}
 
export default ExamGenerationPage;