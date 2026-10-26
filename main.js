let player = {
    height: new Decimal(0),
    level: new Decimal(1),
    exp: {
        value: new Decimal(0)
    },
    saveStart: Date.now(),
    unlocks: 0
}

let lastTick = Date.now()

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
                setVisibility(buttons["home-test-button"], false)
            }
            break
        case 1:
            setText("statistics-unlocks", "You have unlocked all there is to unlock! For now...")
            setVisibility(buttons["home-test-button"], true)
            break
    }
}

const gameLoop = setInterval(() => {
    let dt = Date.now() - lastTick
    let speed = getPlayerSpeed()
    let height_floor = getFloorHeight(player.level.sub(1))
    player.height = player.height.add(speed.mul(dt).div(1000))

    setText("home", `
        You are on floor <b>${format(player.level, false, true)}</b>.

        You are <b>${format(player.height)}</b> / <b>${format(height_floor)}</b> m up this floor.
    `)

    updateStatistics()
    checkForUnlocks()

    bars["home-height-bar"].style.width = `${player.height.div(height_floor).mul(100).toNumber()}%`
    if (player.height.gte(height_floor)) {
        player.height = player.height.sub(height_floor)
        player.level = player.level.add(1)
    }
    lastTick += dt
}, 50)

if (load()) console.log("game loaded")
const saveLoop = setInterval(() => {
    save()
}, 15000)