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

function addElement(id, width, height, offsetX, offsetY, title, ...styleObject) {
    const el = document.createElement("div")
    el.id = id
    el.style.position = "absolute"
    el.style.width = `${width * 32}px`
    el.style.height = `${height * 32}px`
    el.style.left = `${offsetX * 32}px`
    el.style.top = `${offsetY * 32}px`

    if (title) {
        const title_el = document.createElement("div")
        title_el.style.width = "calc(100% - 8px)"
        title_el.style.padding = "4px"
        title_el.style.height = "16px"
        title_el.style.backgroundColor = "#339944"
        title_el.style.color = "#ccc"
        title_el.innerHTML = title
        
        console.log(title_el)
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
    elements[id] = el
    world.appendChild(el)
}

function setText(id, text = "") {
    elements[id].textContent = text
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

addElement("home", 8, 12, 0, 0, "The Tower", BG, PRIMARY)
addElement("exp", 8, 10, 9, 0, "", BG, MINOR)
addElement("rabbits", 12, 4, 0, 13, "", BG, MINOR)

//setText("home", "hello world!")