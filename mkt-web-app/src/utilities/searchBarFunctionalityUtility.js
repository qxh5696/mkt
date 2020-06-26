export const questionSearchFilter = (questions, name, subject, type, course) => {
    let nameSearch = true;
    let typeSearch = true;
    let subjectSearch = true;
    let courseSearch = true;
    const new_questions_list = (questions.filter((question) => {
        const nameField = name.toLowerCase();
        if (nameField) {
            if (question.name) {
                nameSearch = question.name.toLowerCase().indexOf(nameField) !== -1;
            }
        }
        const subjectField = subject.toLowerCase();
        if (subjectField) {
            if (question.subject) {
                subjectSearch = question.subject.toLowerCase().indexOf(subjectField) !== -1;
            }
        }
        const typeField = type.toLowerCase();
        if (typeField) {
            if (question.questionType) {
                typeSearch = question.questionType.toLowerCase().indexOf(typeField) !== -1;
            }
        }
        const  courseField = course.toLowerCase();
        if (courseField) {
            if (question.course) {
                courseSearch = question.course.toLowerCase().indexOf(courseField) !== -1;
            }
        }
        return nameSearch && subjectSearch && typeSearch && courseSearch;
    }));
    return new_questions_list;
}

export const examSearchFilter = (exams, name, subject, course) => {
    let nameSearch = true;
    let subjectSearch = true;
    let courseSearch = true;
    const exams_list = (exams.filter((exam) => {
        const { examName, examSubject, examCourse } = exam;
        const nameField = name.toLowerCase();
        if (nameField) {
            if (examName) {
                nameSearch = examName.toLowerCase().indexOf(nameField) !== -1;
            }
        }
        const subjectField = subject.toLowerCase();
        if (subjectField) {
            if (examSubject) {
                subjectSearch = examSubject.toLowerCase().indexOf(subjectField) !== -1;
            }
        }
        const courseField = course.toLowerCase();
        if (courseField) {
            if (examCourse) {
                courseSearch = examCourse.toLowerCase().indexOf(courseField) !== -1;
            }
        }
        return nameSearch && subjectSearch && courseSearch;
    }));
    return exams_list;
}