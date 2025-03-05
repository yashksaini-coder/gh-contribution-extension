document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(document.querySelectorAll("input[type=color]"));
  const saveBtn = document.getElementById("save");
  const resetBtn = document.getElementById("reset");

  const defaultColors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  let currentColors = [...defaultColors]; // Initialize with default colors

  // Load saved colors
  chrome.storage.sync.get("colors", (data) => {
    currentColors = data.colors || defaultColors;
    inputs.forEach((input, i) => input.value = currentColors[i]);
    
    // Check if on GitHub page and update colors after loading
    checkGitHubAndUpdateColors(currentColors);
  });

  // Save colors and update graph
  saveBtn.addEventListener("click", () => {
    const colors = inputs.map(input => input.value);
    currentColors = colors; // Update the current colors
    chrome.storage.sync.set({ colors }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "updateColors", colors });
      });
    });
  });

  resetBtn.addEventListener("click", () => {
    inputs.forEach((input, i) => input.value = defaultColors[i]);
    currentColors = [...defaultColors]; // Update the current colors
    chrome.storage.sync.set({ colors: defaultColors }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "updateColors", colors: defaultColors });
      });
    });
  });

  // Function to check if on GitHub page and update colors
  function checkGitHubAndUpdateColors(colors) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url && activeTab.url.includes("https://github.com/")) {
        chrome.tabs.sendMessage(activeTab.id, { action: "updateColors", colors }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Content script not found. Ensure you're on a GitHub page.");
          } else {
            console.log("Colors updated successfully.");
          }
        });
      } else if (activeTab) {
        alert("Active tab is not a GitHub page.");
      }
    });
  }
});

