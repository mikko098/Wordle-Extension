function addButton(word_list, answer_list) {
    function checkWord(guess, answer){
        let output = ["N","N","N","N","N"]
        let answerlist = answer.split("")
        for (let i = 0; i < 5; i++){
            if (guess[i] == answerlist[i]){
                output[i] = "G"
                answerlist[i] = null
            }
        }

        for (let i = 0; i < 5; i++){
            if (output[i]=="N" && answerlist.includes(guess[i])){
                output[i] = "Y"
                answerlist[answerlist.indexOf(guess[i])] = null
            }
        }
        
        return output.join("")
    }

    function newList(guess, permutation, list) {
        const newList = [];
        for (const answer of list) {
            if (checkWord(guess, answer) === permutation) {
                newList.push(answer);
            }
        }
        return newList;
    }

    function findProbabilityDict(guess, answerList) {
        const probabilityDict = {};
        const n = answerList.length;

        for (const answer of answerList) {
            const perm = checkWord(guess, answer)

            if (probabilityDict[perm]) {
                probabilityDict[perm] += 1 / n;
            } else {
                probabilityDict[perm] = 1 / n;
            }
        }

        return probabilityDict;
    }

    function calculateEntropy(probabilityDict) {
        let entropy = 0;

        for (const probability of Object.values(probabilityDict)) {
            entropy += -1 * (probability * (Math.log(probability) / Math.log(2))); // log base 2
        }

        return entropy;
    }

    function nextGuessInitialStep(remainingWordsList, answerList) {
        let maxEntropy = 0;
        let bestWord = "";

        for (const word of remainingWordsList) {
            const probDict = findProbabilityDict(word, answerList);
            const entropy = calculateEntropy(probDict);

            if (entropy > maxEntropy) {
                maxEntropy = entropy;
                bestWord = word;
            }
        }

        return bestWord;
    }

    function nextGuessFinalStep(remainingWordsList, answerList) {
        let maxEntropy = 0;
        let bestWord = "";

        for (const word of remainingWordsList) {
            const probDict = findProbabilityDict(word, answerList);
            let entropy = calculateEntropy(probDict);

            if (!answerList.includes(word)) {
                entropy *= 0.3; // penalize non-answers
            }

            if (entropy > maxEntropy) {
                maxEntropy = entropy;
                bestWord = word;
            }
        }

        return bestWord;
    }

    function nextGuess(wordList, answerList, firstGuess) {
        if (firstGuess) {
            return "slate"; // your starting word
        }

        if (answerList.length === 1) {
            return answerList[0]; // Only one possible solution left
        }

        if (answerList.length >= 4) {
            return nextGuessInitialStep(wordList, answerList);
        } else {
            return nextGuessFinalStep(wordList, answerList, []);
        }
    }

    const rows = document.getElementsByClassName("Row-module_row__pwpBq")
    const map = { correct: 'G', present: 'Y', absent: 'N' };
    const information = [];
    let firstGuess = true

    for (let i = 0; i < rows.length; i++) {
        let perm_array = [];
        const cells = rows[i].getElementsByClassName("Tile-module_tile__UWEHN");

        for (let j = 0; j < cells.length; j++) {
            const state = cells[j].getAttribute('data-state');
            if (state === "empty" || state === "tbd"){
                perm_array = null
                break
            }
            perm_array.push(map[state] || '?');
        }

        if (perm_array != null)
            information.push([rows[i].textContent, perm_array.join("")]);
    }

    information.forEach(answerPermPair => {
        firstGuess = false
        let guess = answerPermPair[0]
        let perm = answerPermPair[1]
        if (perm === "GGGGG")
            return "already solved"
        answer_list = newList(guess, perm, answer_list)
    })

    return nextGuess(word_list, answer_list, firstGuess)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "inject") {
    (async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      async function loadWordList(url) {
        const response = await fetch(chrome.runtime.getURL(url));
        const data = await response.text();
        return data.split("\r\n");
      }

      const word_list = await loadWordList("src/code/wordlist.txt");
      const answer_list = await loadWordList("src/code/solutionlist.txt");

      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: addButton,
        args: [word_list, answer_list],
      });

      sendResponse({ suggestedWord: result });
    })();

    return true;
  }
});

