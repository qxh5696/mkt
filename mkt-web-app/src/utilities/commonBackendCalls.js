import NetworkUtils from './networkUtilities';


export function fetchQuestions() {
    return NetworkUtils.commonGet('/questions');
}