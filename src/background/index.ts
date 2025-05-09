chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({   
        func: () => {
            const rows = document.getElementsByClassName("Row-module_row__pwpBq")
            for (let i = 0; i < rows.length; i++){
                const cells = rows[i].getElementsByClassName("Tile-module_tile__UWEHN")
                if (cells[0].getAttribute("data-state") == "absent" || cells[0].getAttribute("data-state") == "present" || cells[0].getAttribute("data-state") == "correct"){
                    console.log(rows[i].textContent)
                }
                console.log("NEW ROW")
            }
            // for (let i = 0; i < cells.length; i++){
            //     const cell = cells[i]
            //     if (cell.getAttribute("data-state") == "empty" || cell.getAttribute("data-state") == "tbd"){
            //     }
            //     else{
                    
            //     }
            // }
        },
        target: {
            tabId: tab.id || 0
        }
    })
})