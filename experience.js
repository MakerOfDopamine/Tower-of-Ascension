function getExpMultiplier() {
    let mul = new Decimal(1)

    return mul
}

function getExpPow() {
    let pow = new Decimal(1.01)

    return pow
}

function getExperience(level) {
    let base = Decimal.sumGeometricSeries(level, 10, 1.01, 0).mul(getExpMultiplier()).pow(getExpPow()).floor().div(100)
    if (player.exp.upgrades[0]) base = base.mul(2)
    base = base.mul(getExperienceUpgradeEffect(2))

    return base
}

function getExperienceHeightBoost() {
    let exp = player.exp.value
    return exp.add(1).sqrt().log10().add(1)
}

function resetExp() {
    if (player.level.gte(10)) {
        player.exp.value = player.exp.value.add(getExperience(player.level))
        player.level = new Decimal(1)
        player.height = new Decimal(0)
        if (player.unlocks == 1) player.unlocks = 2
        unlock(1)
    }
}

function getExpUpgradeCost(i) {
    switch (i) {
        case 0: return new Decimal(1)
        case 1: return new Decimal(player.exp.upgrades[1]).add(1).pow(1.3).round()
        case 2: return new Decimal(player.exp.upgrades[2]).add(1).pow(1.5).round()
        default: console.error("Unknown exp upgrade amount: ", i); return new Decimal(0)
    }
}

function getExperienceUpgradeEffect(i) {
    switch (i) {
        case 1: 
        case 2:
            let base = new Decimal(0)
            base = base.add(0.02).mul(player.exp.upgrades[i])
            return base.add(1)
        default: console.error("Unknown upgrade effect query: ", i); return new Decimal(0)
    }
}

function buyExpUpgrade(i) {
    if (player.exp.value.lt(getExpUpgradeCost(i))) return
    if (typeof player.exp.upgrades[i] == 'boolean') {
        if (!player.exp.upgrades[i]) {
            player.exp.value = player.exp.value.sub(getExpUpgradeCost(i))
            player.exp.upgrades[i] = true
            updateUpgradeBackdrops()
        }
    } else {
        if (player.exp.upgrades[i] <= STATIC.exp.upg_max[i]) {
            player.exp.value = player.exp.value.sub(getExpUpgradeCost(i))
            player.exp.upgrades[i] += 1
            updateUpgradeBackdrops()
        }
    }
}

