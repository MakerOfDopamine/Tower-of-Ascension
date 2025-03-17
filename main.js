let player = {
    is_climbing: false,
    height: new Decimal(0),
    level: new Decimal(1)
}

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

function getHeightPerTick() {
    let speed = new Decimal(1).div(20)
    if (1 == 0) {
        speed = speed.mul(1.5)
    }
    return speed
}

function getTowerFloorHeight(floor) {
    return new Decimal(10).mul(new Decimal(floor).sub(1).pow_base(1.01))
}

function start_climbing() {
    player.is_climbing = true

}

if (load()) {alert("Loaded save.")}

let floor_height = getTowerFloorHeight(player.level)
setInterval(() => {
    setText("tower-status", player.is_climbing, "You are climbing the Tower of Ascension.", "You are at the foot of an infinitely tall tower.")
    setText("tower-height", player.is_climbing, `You are currently at ${format(player.height)} m / ${format(floor_height)} m.`)
    setText("tower-level", player.is_climbing, `You are currently on floor ${format(player.level, player.level.gte(1e9) ? 2 : 0)}.`)
    if (player.is_climbing) {
        player.height = player.height.add(getHeightPerTick())
        if (player.height.gte(floor_height)) {
            player.height = player.height.sub(floor_height)
            player.level = player.level.add(1)
            floor_height = getTowerFloorHeight(player.level)
        }
    }
}, 50)