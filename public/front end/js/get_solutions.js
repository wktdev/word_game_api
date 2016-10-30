function checkEachRowForCharacter(word, matrix) {
    var word = word.split('');
    var matrixClone = matrix.slice(0);
    word.forEach(function(character) {

        for (var i = 0; i < matrixClone.length; i += 1) {
            if (matrixClone[i].includes(character)) {
                matrixClone.splice(i, 1);
                break;


            } else {

            }

        }
    });

    if (matrixClone.length === 0) {
        return word.join('')
    } else {
        return false
    }
}


function getAnswers(matrix) {
    var answer = [];


    dictionary.forEach(function(val) {

        var result = checkEachRowForCharacter(val, matrix)

        if (result) {
            answer.push(result)

        }
    });
    return answer
}