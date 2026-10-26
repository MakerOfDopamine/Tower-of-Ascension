function showOptions() {
    document.getElementById("options-tab").style.display = "flex";
    document.getElementById("statistics-tab").style.display = "none";
}

function showStatistics() {
    document.getElementById("options-tab").style.display = "none";
    document.getElementById("statistics-tab").style.display = "flex";
}

function updateStatistics() {
    document.getElementById("statistics-main").textContent = `
        You have played for a total of ${formatTime((Date.now() - player.saveStart) / 1000)}.
    `
}