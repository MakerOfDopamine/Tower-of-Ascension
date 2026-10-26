const viewport = document.getElementById("viewport")
const world = document.getElementById("world")
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

function addElement(id, width, height, offsetX, offsetY, title, ...styleObject) {
    const el = document.createElement("div")
    el.id = `${id}-container`
    el.style.position = "absolute"
    el.style.width = `${width * grid_size}px`
    el.style.height = `${height * grid_size}px`
    el.style.left = `${offsetX * grid_size}px`
    el.style.top = `${offsetY * grid_size}px`

    if (title) {
        const title_el = document.createElement("div")
        title_el.style.width = "calc(100% - 8px)"
        title_el.style.padding = "4px"
        title_el.style.height = "16px"
        title_el.style.backgroundColor = "#339944"
        title_el.style.color = "#ccc"
        title_el.innerHTML = title
        
        el.appendChild(title_el)
    }
    
    // Default
    el.style.background = "lightgrey"
    //el.style.border = "1px solid black"
    el.style.boxShadow = "var(--box-shadow-color) var(--box-shadow-size) var(--box-shadow-size)" // this is so that we can change the box shadow without having to know what color it was before because stupid css doesn't have a separate property for this thing for some reason
    el.style.setProperty("--box-shadow-color", "#a3a3a3")
    el.style.setProperty("--box-shadow-size", "0px")
    el.style.padding = "8px"
    el.style.boxSizing = "border-box" // WHY. are you. resizing my elements. this took me 20 minutes to find istg

    for (let obj of styleObject) {
        for (let i of Object.keys(obj)) {
            if (el.style[i] === undefined) { // These should only be undefined when the element to set is custom and thus not exposed.
                el.style.setProperty(i, obj[i])
            } else {el.style[i] = obj[i]}
        }
    }

    const content_el = document.createElement("div")
    content_el.id = id;
    content_el.style.height = "fit-content";
    content_el.style.paddingTop = "8px"

    el.classList.add("newline")
    el.appendChild(content_el)
    elements[id] = el
    world.appendChild(el)
}

function addBar(parent_id, bar_id = parent_id, ...styleObject) {
    const bar_el = document.createElement("div")
    const bar_inner_el = document.createElement("div")
    bar_el.id = `${parent_id}-${bar_id}-container`
    bar_inner_el.id = `${parent_id}-${bar_id}-bar`
    bar_el.style.marginBottom = "8px"
    bar_el.style.marginTop = "8px"

    bar_el.classList.add("progress-container")
    bar_el.role = "progressbar"
    bar_inner_el.classList.add("progress")

    bar_el.appendChild(bar_inner_el)
    for (let obj of styleObject) {
        for (let i of Object.keys(obj)) {
            if (bar_el.style[i] === undefined) { // These should only be undefined when the element to set is custom and thus not exposed.
                bar_el.style.setProperty(i, obj[i])
            } else {bar_el.style[i] = obj[i]}
        }
    }

    elements[parent_id].appendChild(bar_el)
    bars[`${parent_id}-${bar_id}`] = bar_inner_el
}

function addButton(parent_id, button_id = parent_id, content, onclick = () => {}, ...styleObject) {
    const button_el = document.createElement("button")
    button_el.id = `${parent_id}-${button_id}-button`
    button_el.innerHTML = content
    button_el.onclick = onclick

    button_el.classList.add("game-button")
    for (let obj of styleObject) {
        for (let i of Object.keys(obj)) {
            if (button_el.style[i] === undefined) {
                button_el.style.setProperty(i, obj[i])
            } else {button_el.style[i] = obj[i]}
        }
    }

    elements[parent_id].appendChild(button_el)
    buttons[`${parent_id}-${button_id}`] = button_el
}

function setText(id, text = "") {
    document.getElementById(id).innerHTML = text
}

function setVisibility(obj, visible, default_visibility = "block") {
    (typeof obj == "string" ? document.getElementById(obj) : obj).style.display = (visible ? default_visibility : "none")
}

function displayHome() {
    offsetX = window.innerWidth / 2 - 128
    offsetY = window.innerHeight / 2 - 192

    updateDisplay(0, 0);
}

// Whee initialization go br

const BG = {
    "background": "rgb(155, 188, 211)"
}

const PRIMARY = {
    "--box-shadow-size": "8px"
}

const MINOR = {
    "--box-shadow-size": "2px"
}

const BUTTON_BASE = {
    "height": "auto",
    "font": "inherit",
    "color": "lightgrey",
    "backgroundColor": "#444444",
    "border": "0",
    "boxShadow": "#222222 1px 1px",
    "transition": "all 0.1s ease-in-out"
}

addElement("home", 8, 8, 0, 0, "The Tower", BG, PRIMARY)
//addElement("exp", 8, 10, 9, 0, "", BG, MINOR)
addElement("rabbits", 12, 4, 0, 13, "bunnies :3", BG, MINOR)

addBar("home", "height-bar")
addButton("home", "test-button", "Press me", () => {alert("Hello!")}, BUTTON_BASE)

setText("rabbits", "🐇!")