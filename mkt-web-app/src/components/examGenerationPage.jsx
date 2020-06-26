import React from 'react';
import NetworkUtils from '../utilities/networkUtilities';
import StringUtils from '../utilities/stringUtilities';
import * as commonExamFunctions from '../components/subComponents/examElement';
import { createBrowserHistory as createHistory } from 'history';
import  { QuestionSearchBar } from './subComponents/questionSearchBar';
import { questionSearchFilter } from '../utilities/searchBarFunctionalityUtility';
 
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
                displayQuestions: questionsNotInExam
            });
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
            <div className='container'>
                <h1>Exam Generation Form</h1>
                <div className='exam-section'>
                    {commonExamFunctions.renderExamForm(
                        this.state.examObject,
                        this.trackExamChange,
                        this.removeQuestionSetStateCallBack
                    )}    
                    <button className="btn btn-primary" onClick={() => {this.generateExam()}}> Generate Exam </button>
                </div>
                <h1>Question Bank</h1>
                {QuestionSearchBar(this.searchForQuestion)}
                <div className='question-section'>
                    {!this.state.isLoading ? (
                        commonExamFunctions.renderQuestions(
                            this.state.displayQuestions,
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