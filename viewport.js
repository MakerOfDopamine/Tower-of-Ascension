const viewport = document.getElementById("viewport")
const world = document.getElementById("world")
const elements = {}

let mouseX = 0
let mouseY = 0
let offsetX = window.innerWidth / 2 - 128
let offsetY = window.innerHeight / 2 - 192
let parallax_scale = 0.25
let isMouseDown = false

function updateDisplay(bx, by) {
    viewport.style.backgroundPositionX = (offsetX - bx) * parallax_scale + "px"
    viewport.style.backgroundPositionY = (offsetY - by) * parallax_scale + "px"
    world.style.transform = `translate(${offsetX - bx}px, ${offsetY - by}px)`
}
updateDisplay(0, 0);

viewport.addEventListener("mousedown", (e) => {
    e.preventDefault()

    mouseX = e.clientX
    mouseY = e.clientY
    isMouseDown = true
})

viewport.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        updateDisplay((mouseX - e.clientX), (mouseY - e.clientY))
    }
})

viewport.addEventListener("mouseup", (e) => {
    offsetX = (offsetX - (mouseX - e.clientX))
    offsetY = (offsetY - (mouseY - e.clientY))
    isMouseDown = false
})

function addElement(id, width, height, offsetX, offsetY, styleObject = {}) {
    const el = document.createElement("div")
    el.id = id
    el.style.position = "absolute"
    el.style.width = `${width * 32}px`
    el.style.height = `${height * 32}px`
    el.style.left = `${offsetX * 32}px`
    el.style.top = `${offsetY * 32}px`
    
    // Default
    el.style.background = "lightgrey"
    el.style.border = "1px solid black"
    el.style.padding = "8px"
    el.style.boxSizing = "border-box" // WHY. are you. resizing my elements. this took me 20 minutes to find istg

    for (let i of Object.keys(styleObject)) {
        el.style[i] = styleObject[i]
    }
    elements[id] = el
    world.appendChild(el)
}

function setText(id, text = "") {
    elements[id].textContent = text
}

const BG = {
    "background": "rgb(188, 188, 211)"
}

addElement("test", 8, 12, 0, 0, BG)
addElement("test2", 8, 10, 9, 0, BG)
addElement("test3", 12, 4, 0, 13, BG)

setText("test", "hello world!")