
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
    
    static commonGet(url, successCallBack, errorCallBack) {
        fetch(url)
            .then(response => response.json())
            .then(data => successCallBack(data))
            .catch(error => errorCallBack(error));
    }
}

export default NetworkUtils;


