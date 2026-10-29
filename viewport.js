const viewport = document.getElementById("viewport")
const world = document.getElementById("world")
const tooltip = document.getElementById("tooltip-object")
const elements = {}
const bars = {}
const buttons = {}
const grid_size = 32
const parallax_scale = 0.2

let mouseX = 0
let mouseY = 0
let offsetX = window.innerWidth / 2 - 128
let offsetY = window.innerHeight / 2 - 192
let isMouseDown = false

function updateDisplay(bx, by) {
    viewport.style.backgroundPositionX = (offsetX - bx) * parallax_scale + "px"
    viewport.style.backgroundPositionY = (offsetY - by) * parallax_scale + "px"
    world.style.transform = `translate(${offsetX - bx}px, ${offsetY - by}px)`
}
updateDisplay(0, 0);

viewport.addEventListener("mousedown", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    isMouseDown = true
})

viewport.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        updateDisplay((mouseX - e.clientX), (mouseY - e.clientY))
    }

    tooltip.style.transform = `translate(${e.clientX + 20}px, ${e.clientY + 20}px)`
})

viewport.addEventListener("mouseup", (e) => {
    offsetX = (offsetX - (mouseX - e.clientX))
    offsetY = (offsetY - (mouseY - e.clientY))
    isMouseDown = false
})

function displayHome() {
    offsetX = window.innerWidth / 2 - 128
    offsetY = window.innerHeight / 2 - 192

    updateDisplay(0, 0);
}

document.querySelectorAll("*.show-tooltip").forEach((el) => {
    el.addEventListener("pointerenter", () => {
        const tooltipElement = document.getElementById(el.getAttribute("data-tooltip"))
        tooltip.innerHTML = tooltipElement.innerHTML
    })
})