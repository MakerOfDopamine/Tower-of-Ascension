let player = {
    height: new Decimal(0),
    level: new Decimal(1),
    exp: {
        value: new Decimal(0),
        upgrades: [false, 0, 0]
    },
    saveStart: Date.now(),
    unlocks: 0,
    area_unlocks: 0
}

const STATIC = {
    exp: {
        upg_max: [0, 100, 100]
    }
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
    // All upgrades are processed: [Buffs to base speed] => [Multipliers] => [Buffs to flat speed] => [Powers] => [Buffs to final speed]
    let base = new Decimal(1)

    // Base speed

    // Multipliers
    base = base.mul(getExperienceHeightBoost())
    if (player.exp.upgrades[0]) base = base.mul(2)
    base = base.mul(getExperienceUpgradeEffect(1))

    // Flat speed

    // Powers

    // Final speed

    return base
}

function getFloorHeight(F) {
    // Height of floor F
    F = new Decimal(F)
    return new Decimal(5).mul(F.pow_base(1.01)).mul(F.pow(2).pow_base(1.00001))
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
            setText("statistics-unlocks", "You might unlock something by becoming more experienced.")
            setVisibility("unlock-0-button", player.area_unlocks == 0 ? true : false)
            break
        case 2:
            setText("statistics-unlocks", "You've unlocked everything... for now.")
            setVisibility("unlock-0-button", false)
    }
}

function unlock(x) {
    if (player.unlocks == player.area_unlocks) return
    switch (x) {
        case 0:
            document.getElementById("exp-tab").style.display = "flex";
            break
        case 1:
            document.getElementById("exp-upgrades-tab").style.display = "flex";
            break
    }
    player.area_unlocks = player.unlocks
    save()
}

// Tooltip ids can just not exist sometimes
// This function only sets when the id exists so my loop doesn't explode when setting to null
function _set(id, val) {
    const el = document.getElementById(id)
    if (el) {
        el.textContent = val
    }
}

function updateTooltipData() {
    _set("exp-upgrade-0-data-bought", player.exp.upgrades[0] ? "Bought!" : "Not bought")
    _set("exp-upgrade-1-data-cost", format(getExpUpgradeCost(1), false, true))
    _set("exp-upgrade-1-data-bought", `${player.exp.upgrades[1]} / ${STATIC.exp.upg_max[1]}`)
    _set("exp-upgrade-1-data-effect", `${formatEffect(getExperienceUpgradeEffect(1).sub(1))}`)
    _set("exp-upgrade-2-data-cost", format(getExpUpgradeCost(2), false, true))
    _set("exp-upgrade-2-data-bought", `${player.exp.upgrades[2]} / ${STATIC.exp.upg_max[2]}`)
    _set("exp-upgrade-2-data-effect", `${formatEffect(getExperienceUpgradeEffect(2).sub(1))}`)
}

function updateUpgradeBackdrops() {
    for (let i = 0; i < player.exp.upgrades.length; i++) {
        if (typeof player.exp.upgrades[i] == 'boolean') {
            if (player.exp.upgrades[i] == true) document.getElementById(`exp-upgrade-${i}`).classList.add("bought-upgrade")
        } else {
            if (player.exp.upgrades[i] == STATIC.exp.upg_max[i]) {
                document.getElementById(`exp-upgrade-${i}`).classList.add("bought-upgrade")
                document.getElementById(`exp-upgrade-${i}`).classList.remove("bought-upgrade-partial")
            } else if (player.exp.upgrades[i] > 0) {
                document.getElementById(`exp-upgrade-${i}`).classList.remove("bought-upgrade")
                document.getElementById(`exp-upgrade-${i}`).classList.add("bought-upgrade-partial")
            }
        }
    }
}

const DEVSPEED = 1
const gameLoop = setInterval(() => {
    let dt = Date.now() - lastTick
    let speed = getPlayerSpeed()
    let height_floor = getFloorHeight(player.level.sub(1))
    player.height = player.height.add(speed.mul(dt).div(1000).mul(DEVSPEED))

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

    if (player.unlocks > 1) {
        let exp_mul = getExperienceHeightBoost()
        setText("exp-amount", format(player.exp.value))
        setText("exp-height-multiplier", formatEffect(exp_mul.sub(1)))
    }

    updateStatistics()
    checkForUnlocks()
    updateTooltipData()

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
    if (player.area_unlocks >= 2) document.getElementById("exp-upgrades-tab").style.display = "flex";

    updateUpgradeBackdrops()
}

const saveLoop = setInterval(() => {
    save()
}, 15000)