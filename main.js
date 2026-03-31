let player = {
    height: new Decimal(0),
    level: new Decimal(1),
    exp: {
        value: new Decimal(0)
    }
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
    if (player.level.lt(10) && player.exp.value.eq(0)) {
        return "Climb to floor 10 to unlock something new."
    } else {
        return "You have unlocked everything so far!"
    }
}

if (load()) {alert("Loaded save.")}

let floor_height = getTowerFloorHeight(player.level)
let mainLoop = setInterval(() => {
    dt = (Date.now() - t) / 1000
    floor_height = getTowerFloorHeight(player.level)
    setText("tower-status", "You are climbing the Tower of Ascension.")
    setText("tower-height", `You are currently at ${format(player.height, player.height.gte(1e9) ? 2 : 1)} m / ${format(floor_height, floor_height.gte(1e9) ? 2 : 1)} m.`)
    setText("tower-level" , `You are currently on floor ${format(player.level, player.level.gte(1e9) ? 2 : 0)}.`)
    setText("exp-display", `You currently have ${format(player.exp.value, 2)} EXP.`)
    player.height = player.height.add(getHeightPerSec().mul(dt))
    if (player.height.gte(floor_height)) {
        let levels = Decimal.affordGeometricSeries(player.height, 10, 1.01, player.level)
        let totalDist = Decimal.sumGeometricSeries(levels, 10, 1.01, player.level)
        player.height = player.height.sub(totalDist)
        player.level = player.level.add(levels)
        floor_height = getTowerFloorHeight(player.level)
    }
    setText("next-unlock", getUnlocks())

    if (player.level.gte(10)) {
        setText("exp-reset", `You see an elevator in the tower, but all of them go downwards only.<br> Maybe if you go back down the tower, you'll be able to climb up more experienced?<br> You think you'll get ${format(getExperience(player.level), 2)} EXP if you went down now.<br>`)
        setStyle("exp-reset-button", "display", "inline-block")
    } else {
        setText("exp-reset", `You haven't seen an elevator yet. Either way, you're still far too low on the tower to get more experience.`)
        setStyle("exp-reset-button", "display", "none")
    }

    t = Date.now()
}, 50)
