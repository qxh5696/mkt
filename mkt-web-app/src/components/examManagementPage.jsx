import React from 'react';
import NetworkUtils from '../utilities/networkUtilities';
import ExamEditView from './subComponents/edittingExamView';
 
class ExamManagementPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            exams: [],
            isLoading: true,
            isEditting: false,
            errors: null,
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

    showExams() {
        if (this.state.exams.length === 0) {
            return (<div> No Exams to Display </div>);
        }
        return (this.state.exams.map((examObject) => {
            const { _id, examCourse, examSubject, examName } = examObject;
            const points = examObject.questions.reduce((acc, curr) => (acc + curr.points), 0);
            return (
                <div className='exam-entry' key={`${_id['$oid']}`}>
                    <div>Exam name: {examName}</div>
                    <div>Course: {examCourse} </div>
                    <div>Subject: {examSubject}</div>
                    <div>Total Points: {points}</div>
                    <button className="btn btn-primary" onClick={() => { 
                        this.setState({ 
                            isEditting: true,
                            currentExam: examObject
                         });
                        }}> Edit Exam</button>
                    <button className="btn btn-danger" onClick={() => {
                        this.deleteExam();
                    }}> Delete Exam</button>
                </div>
            )
        }));
    }

    showExamsOrEditView() {
        if (this.state.isEditting) {
            return <ExamEditView examObject={this.state.currentExam}></ExamEditView>;
        }
        return this.showExams();
    }

    render() {
        return (
            <div>
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