function getExpMultiplier() {
    let mul = new Decimal(1)

    return mul
}

function getExpPow() {
    let pow = new Decimal(1.01)

    return pow
}

function getExperience(level) {
    return Decimal.sumGeometricSeries(level, 10, 1.01, 0).mul(getExpMultiplier()).pow(getExpPow()).floor().div(100)
}

function resetExp() {
    if (player.level.gte(10)) {
        player.exp.value = player.exp.value.add(getExperience(player.level))
        player.level = new Decimal(0)
        player.height = new Decimal(0)
    }
}