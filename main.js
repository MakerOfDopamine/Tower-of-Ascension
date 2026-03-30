let player = {
    height: new Decimal(0),
    level: new Decimal(1)
}
let t = Date.now();
let dt = Date.now();

function setText(id, condition, truetext="", falsetext="") {
    if (typeof condition === "boolean") {
        document.getElementById(id).innerHTML = condition ? truetext : falsetext;
    } else {
        document.getElementById(id).innerHTML = condition;
    }
}

function setStyle(id, styleid, stylevalue) {
    document.getElementById(id).style[styleid] = stylevalue;
}

function getHeightPerSec() {
    let speed = new Decimal(1)
    if (1 == 0) {
        speed = speed.mul(1.5)
    }
    return speed
}

function getTowerFloorHeight(floor) {
    return new Decimal(10).mul(new Decimal(floor).sub(1).pow_base(1.01))
}

function getUnlocks() {
    if (player.level.lt(10)) {
        return "Climb to floor 10 to unlock something new."
    } else {
        return "You have unlocked everything so far!"
    }
}

if (load()) {alert("Loaded save.")}

let floor_height = getTowerFloorHeight(player.level)
let mainLoop = setInterval(() => {
    dt = (Date.now() - t) / 1000
    setText("tower-status", "You are climbing the Tower of Ascension.")
    setText("tower-height", `You are currently at ${format(player.height)} m / ${format(floor_height)} m.`)
    setText("tower-level" , `You are currently on floor ${format(player.level, player.level.gte(1e9) ? 2 : 0)}.`)
    player.height = player.height.add(getHeightPerSec().mul(dt))
    if (player.height.gte(floor_height)) {
        let levels = Decimal.affordGeometricSeries(player.height, 10, 1.01, player.level)
        let totalDist = Decimal.sumGeometricSeries(levels, 10, 1.01, player.level)
        player.height = player.height.sub(totalDist)
        player.level = player.level.add(levels)
        floor_height = getTowerFloorHeight(player.level)
    }
    setText("next-unlock", getUnlocks())

    t = Date.now()
}, 50)

let buttonLoop = setInterval(() => {
    manageTabs()
}, 250)