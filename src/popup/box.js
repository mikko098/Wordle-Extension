document.getElementById("inject").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "inject" }).then(response => {
    document.getElementById("output").textContent = "best guess: " + response.suggestedWord;
  });
});
