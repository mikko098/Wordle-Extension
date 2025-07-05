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
    
    return output
}

function addButton() {
    const button = document.createElement("button");
    button.textContent = "balls";
    button.onclick = () => {
        const rows = document.getElementsByClassName("Row-module_row__pwpBq")
        for (let i = 0; i < rows.length; i++){
            console.log(checkWord(rows[i].textContent),"baler")
            const cells = rows[i].getElementsByClassName("Tile-module_tile__UWEHN")
            for (let i = 0; i < cells.length; i++){
                const cell = cells[i]
            }
        }
    }
    document.getElementsByClassName("App-module_gameContainer__K_CBh")[0].appendChild(button)
}

addButton()