// Function to update the graph colors
function updateGraphColors(colors) {
  const squares = document.querySelectorAll(".ContributionCalendar-day");
  squares.forEach(square => {
    const level = square.getAttribute("data-level");
    if (level !== null) {
      square.style.backgroundColor = colors[level];
    }
  });
}

// Get user-selected colors from storage
chrome.storage.sync.get("colors", (data) => {
  const defaultColors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const colors = data.colors || defaultColors;
  updateGraphColors(colors);
});

// Listen for changes from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateColors") {
    updateGraphColors(request.colors);
    sendResponse({ status: "done" });
  }
});

