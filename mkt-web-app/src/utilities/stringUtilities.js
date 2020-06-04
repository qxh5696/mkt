class StringUtils {
    static titleCase(sentence, joinString='') {
        var splitSentence = sentence.toLowerCase().split(' ');
        
        for(var i = 0; i< splitSentence.length; i++) {
            splitSentence[i] = splitSentence[i][0].toUpperCase() + splitSentence[i].slice(1);
        }
        return splitSentence.join(joinString);
    }

    static convertIdToJSONKey(htmlId) {
        var htmlIdSplit = htmlId.split('-');
        if (htmlIdSplit.length == 1) {
            return htmlIdSplit[0]
        }
        for (var i = 1; i < htmlIdSplit.length; i++) {
            htmlIdSplit[i] = this.titleCase(htmlIdSplit[i]);
        }
        
        return  htmlIdSplit.join('');
    }
}

export default StringUtils;
