document.addEventListener("DOMContentLoaded", () => {
    const inputs = Array.from(document.querySelectorAll("input[type=color]"));
    const saveBtn = document.getElementById("save");
  
    // Load saved colors
    chrome.storage.sync.get("colors", (data) => {
      const colors = data.colors || ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
      inputs.forEach((input, i) => input.value = colors[i]);
    });
  
    // Save colors and update graph
    saveBtn.addEventListener("click", () => {
      const colors = inputs.map(input => input.value);
      chrome.storage.sync.set({ colors }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "updateColors", colors });
        });
      });
    });
  });
  