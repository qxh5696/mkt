
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

    static postWithJSONResponse(url, body, onFetchComplete, onFetchFailure) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(json => onFetchComplete(json))
        .catch(error => onFetchFailure(error));
    }

    static postWithBLOBResponse(url, body, onFetchComplete, onFetchFailure) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.blob())
        .then(myBlob => onFetchComplete(myBlob))
        .catch(error => onFetchFailure(error));
    }
}

export default NetworkUtils;


