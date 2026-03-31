const tabList = ["tower", "exp"]

function switchTab(tabn) {
    for (let i of tabList) {
        document.getElementById(i).style.display = "none";
    }
    document.getElementById(tabList[tabn]).style.display = "inline-block";
}

function manageTabs() {
    for (let i of tabList) {
        document.getElementById(i + "-tab-button").style.display = 1;
    }
}