import React from 'react';
import NetworkUtils from '../utilities/networkUtilities';
import ExamEditView from './subComponents/edittingExamView';
import ExamPreviewWindow from './subComponents/examPreview';
import '../assets/scss/examManagement.css';
import { ExamSearchBar } from './subComponents/questionSearchBar';
import { examSearchFilter } from '../utilities/searchBarFunctionalityUtility';  

class ExamManagementPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            exams: [],
            displayExamsList: [],
            isLoading: true,
            isEditting: false,
            isShowingPreview: false,
            errors: null,
            pdf: null,
            examSearchTerms: {
                examName: '',
                examSubject: '',
                examCourse: '',
            }
        };
    }

    componentDidMount() {        
        this.fetchExams();
    }

    fetchExams() {
        NetworkUtils.commonGet('/getExams', 
        (data) => {
            this.setState({
                exams: data['exams'],
                displayExamsList: data['exams'],
                isLoading: false
            })
        }, (error) => {
            console.log(error);
            this.setState({
                error: error,
                isLoading: false
            });
        })
    }

    deleteExam(examObject) {
        NetworkUtils.commonPost('/deleteExam', {'_id': examObject._id['$oid']});
    }

    createExamPreview(examObject) {
        NetworkUtils.postWithJSONResponse('/getExamPreview', examObject,
        (data) => {
            const preview = data['examPreview'];
            console.log(preview !== undefined);
        },
        (error) => {
            console.log(error);
        });
    }

    showExams() {
        if (this.state.exams.length === 0) {
            return (<div> No Exams to Display </div>);
        }
        return (this.state.displayExamsList.map((examObject) => {
            const { _id, examCourse, examSubject, examName } = examObject;
            const points = examObject.questions.reduce((acc, curr) => (acc + curr.points), 0);
            return (
                <div className='exam-entry' key={`${_id['$oid']}`}>
                    <h2>Exam name: {examName}</h2>
                    <p>Course: {examCourse} </p>
                    <p>Subject: {examSubject}</p>
                    <p>Total Points: {points}</p>
                    <div className='exam-management-buttons'>
                        <button className="btn btn-primary" onClick={() => { 
                            this.setState({ 
                                currentExam: examObject,
                                isEditting: true,
                            });
                            }}> Edit Exam</button>
                        <button className="btn btn-danger" onClick={() => {
                            this.deleteExam(examObject);
                        }}> Delete Exam</button>
                        <button className="btn btn-secondary" onClick={() => {
                            this.setState({
                                currentExam: examObject,
                                isShowingPreview: true
                            })
                        }}>Create exam preview</button>
                    </div>
                    <hr/>
                </div>
            )
        }));
    }

    showExamsOrEditView() {
        if (this.state.isEditting) {
            return <ExamEditView examObject={this.state.currentExam}></ExamEditView>;
        } else if (this.state.isShowingPreview) {
            return (
                <div>
                    <ExamPreviewWindow examObject={this.state.currentExam} 
                                    onPreviewCompleted={(pdfLink) => {
                                        this.setState({pdf: pdfLink});
                                    }}></ExamPreviewWindow>
                    <a className="btn btn-primary" href={this.state.pdf}>Download Exam PDF</a>
                    <button className="btn btn-danger" onClick={() => {
                        this.setState({
                            isShowingPreview: false
                        })
                    }}>Exit Exam Preview</button>
                </div>
            
            )
        }
        return this.showExams();
    }

    searchBarCallBack = (e) => {
        this.setState({
            examSearchTerms: {
                ...this.state.examSearchTerms,
                [e.target.name]: e.target.value
            } 
        });
        
        console.log(e.target.name);
        console.log(e.target.value);
        const newExamsList = examSearchFilter(
                this.state.exams, 
                this.state.examSearchTerms.examName,
                this.state.examSearchTerms.examSubject,
                this.state.examSearchTerms.examCourse
            );
        console.log(newExamsList);
        this.setState({
            displayExamsList: newExamsList
        });
    }

    render() {
        return (
            <div className='container'>
                <h1>Previous Exams</h1>
                {ExamSearchBar(this.searchBarCallBack)}
                <div className='previous-exams'>
                    {!this.state.isLoading ? (
                        this.showExamsOrEditView()            
                    ) : (
                        <h3>Loading Exams...</h3>
                    )}
                </div>
                
            </div>
         )
    }
}
 
export default ExamManagementPage;