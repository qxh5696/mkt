import React from 'react';
import NetworkUtils from '../../utilities/networkUtilities';
import { arraySubtraction }  from '../../utilities/arrayUtilities';
 
export const loadQuestions = (examObject, setStateCallback) => {
    NetworkUtils.commonGet('/questions', (data) => {
        const questionsNotInExam = arraySubtraction(data['questions'], examObject.questions);
        setStateCallback(questionsNotInExam);
    });
}

const addQuestionToExam = (questionObject, questions, setStateCallBack) => {
    const updatedQuestionsList = questions.filter(question => question._id['$oid'] !== questionObject._id['$oid'])
    setStateCallBack(updatedQuestionsList, questionObject);
}

const removeQuestionFromExam = (questionObject, examObject, setStateCallback) => {
    const updatedExamQuestions = examObject.questions.filter(question => question._id['$oid'] !== questionObject._id['$oid']);
    setStateCallback(updatedExamQuestions, questionObject);
}

export const renderQuestions = (questions, addToExamCallBack) => {
    return (
        questions.map((questionObject) => {
            const { _id, name, points, question, solution } = questionObject;
            return (
                <div key={`${_id['$oid']}`}>
                    <p>Name: {name}</p>
                    <p>Points: {points}</p>
                    <p>Question: {question}</p>
                    <p>Solution: {solution}</p>
                    <button className="btn btn-primary" type="submit" onClick={() => { addQuestionToExam(questionObject, questions, addToExamCallBack); }}>Add Question To Exam</button>
                </div>
            )
        })
    );
}

export const renderExamForm = (examObject, onChangeCallBack, setStateCallback) => {
    const { examName, examCourse, examSubject } = examObject; 
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
                            defaultValue={examCourse}
                            onChange={onChangeCallBack} />
                    </div>
                    <label htmlFor='exam-subject' className='col-sm-1 col-form-label'>Subject:</label>
                    <div className='col-md-2 mb-3'>
                        <input 
                            type='text' 
                            className='form-control' 
                            id='exam-subject'
                            defaultValue={examSubject}
                            onChange={onChangeCallBack} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='exam-name' className='col-sm-1 col-form-label'>Exam Name:</label>
                    <div className='col-sm-2'>
                        <input 
                            type='text' 
                            className='form-control' 
                            id='exam-name' 
                            defaultValue={examName}
                            onChange={onChangeCallBack} />
                    </div>
                </div>
                <div className='exam-questions'>
                    <label htmlFor='questions'>Questions:</label>
                    {examObject.questions.map(
                        (question, idx) => {
                            const {name, points, ques, solution} = question; 
                            return (
                                <div key={`question-${idx}`}>
                                    <p>Name: {name}</p>
                                    <p>Points: {points} </p>
                                    <p>Question: {ques}</p>
                                    <p>Solution: {solution}</p>
                                    <div className='btn btn-danger' 
                                            onClick={() => {removeQuestionFromExam(question, examObject, setStateCallback)}}>
                                                Remove Question</div>
                                </div>
                            )
                        }
                        )}
                </div>
            </form>
        </div>
    );
}

    
