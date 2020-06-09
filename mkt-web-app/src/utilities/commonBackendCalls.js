import NetworkUtils from './networkUtilities';

class CommonBackendCalls {
    fetchQuestions() {
        NetworkUtils.commonGet('/questions', 
        (data) => { return data['questions']},
        (error) => { return error });
    }

    

}

export default CommonBackendCalls;