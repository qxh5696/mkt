
class NetworkUtils {
    static commonPost(url, body) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json());
    }
    
    static commonGet(url, onFetchComplete, onFetchFailure) {
        fetch(url)
            .then(response => response.json())
            .then(data => onFetchComplete(data))
            .catch(error => onFetchFailure(error));
    }
}

export default NetworkUtils;


