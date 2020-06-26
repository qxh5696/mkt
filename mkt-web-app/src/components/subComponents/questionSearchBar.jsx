import React from 'react';

export const QuestionSearchBar = (cb) => {
    return (
        <form className="question-search-bar form-inline" onChange={cb}>
            <h2>Search Bar:</h2>
            <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
            <input type="text" 
                className="form-control mb-2 mr-sm-2" 
                id="inlineFormInputName2" 
                name='name'
                placeholder="Question Name" />

            <div className="input-group mb-2 mr-sm-2">
                <input type="text" 
                    className="form-control" 
                    id="inlineFormInputGroupUsername2" 
                    placeholder="Course"
                    name='course' />
            </div>
            <input type="text" 
                className="form-control mb-2 mr-sm-2" 
                id="inlineFormInputName2" 
                placeholder="Subject"
                name='subject' />

            <input type="text" 
                className="form-control mb-2 mr-sm-2" 
                id="inlineFormInputName2" 
                placeholder="Question Type"
                name='type' />
        </form>
    );
}

export const ExamSearchBar = (cb) => {
    return (
        <form className="exam-search-bar form-inline" onChange={cb}>
            <h2>Search Bar:</h2>
            <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
            <input type="text" 
                className="form-control mb-2 mr-sm-2" 
                id="inlineFormInputName2" 
                placeholder="Exam Name"
                name='examName' />

            <div className="input-group mb-2 mr-sm-2">
                <input type="text" 
                    className="form-control" 
                    id="inlineFormInputGroupUsername2" 
                    placeholder="Course"
                    name='examCourse' />
            </div>
            <input type="text" 
                className="form-control mb-2 mr-sm-2" 
                id="inlineFormInputName2" 
                placeholder="Subject"
                name='examSubject' />
        </form>
    );
}

