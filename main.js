let player = {
    height: new Decimal(0),
    level: new Decimal(1),
    exp: {
        value: new Decimal(0)
    },
    saveStart: Date.now(),
    unlocks: 0,
    area_unlocks: 0
}

let lastTick = Date.now()

function setText(id, text = "") {
    document.getElementById(id).textContent = text
}

function setWidth(id, width = 0) {
    document.getElementById(id).style.width = `${width}%`
}

function setVisibility(obj, visible, default_visibility = "block") {
    document.getElementById(obj).style.display = (visible ? default_visibility : "none")
}

function getPlayerSpeed() {
    // Player's speed ascending the tower
    // Calculate later
    return new Decimal(1)
}

function getFloorHeight(F) {
    // Height of floor F
    F = new Decimal(F)
    return new Decimal(10).mul(F.pow_base(1.01)).mul(F.pow(2).pow_base(1.00001))
}

function checkForUnlocks() {
    switch (player.unlocks) {
        case 0:
            if (player.level.gte(10)) {
                player.unlocks = 1
            } else {
                setText("statistics-unlocks", "You might unlock something new on floor 10...")
                setVisibility("unlock-0-button", false)
            }
            break
        case 1:
            setText("statistics-unlocks", "You have unlocked all there is to unlock! For now...")
            setVisibility("unlock-0-button", player.area_unlocks == 0 ? true : false)
            break
    }
}

function unlock(x) {
    if (player.unlocks == player.area_unlocks) return
    switch (x) {
        case 0:
            document.getElementById("exp-tab").style.display = "flex";
            player.area_unlocks += 1
            break
    }
    save()
}

const gameLoop = setInterval(() => {
    let dt = Date.now() - lastTick
    let speed = getPlayerSpeed()
    let height_floor = getFloorHeight(player.level.sub(1))
    player.height = player.height.add(speed.mul(dt).div(1000))

    setText("home-level-display", format(player.level, false, true))
    setText("home-current-height", format(player.height))
    setText("home-needed-height", format(height_floor))

    if (player.unlocks > 0) {
        if (player.level.gte(10)) {
            setVisibility("exp-can-reset", true)
            setVisibility("exp-cannot-reset", false)
            setText("exp-reset-amount", format(getExperience(player.level)))
        } else {
            setVisibility("exp-can-reset", false)
            setVisibility("exp-cannot-reset", true)
        }
    }

    updateStatistics()
    checkForUnlocks()

    //bars["home-height-bar"].style.width = `${player.height.div(height_floor).mul(100).toNumber()}%`
    setWidth("home-height-bar", player.height.div(height_floor).mul(100).toNumber())
    if (player.height.gte(height_floor)) {
        player.height = player.height.sub(height_floor)
        player.level = player.level.add(1)
    }
    lastTick += dt
}, 50)

if (load()) {
    console.log("game loaded")
    if (player.area_unlocks >= 1) document.getElementById("exp-tab").style.display = "flex";
}

/*
// Add all gameplay elements
addElement("home", 8, 8, 0, 0, "The Tower", BG, PRIMARY)
addElement("exp", 10, 10, 9, 0, "The Elevator", BG, MINOR, player.area_unlocks < 1 ? INVISIBLE : {})
addElement("rabbits", 12, 4, 0, 13, "bunnies :3", BG, MINOR)

//addBar("home", "height-bar")
addButton("home", "test-button", "You see an elevator...?", () => {unlock(0)}, BUTTON_BASE)

setText("rabbits", "🐇!")
*/
const saveLoop = setInterval(() => {
    save()
}, 15000)