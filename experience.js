function getExpMultiplier() {
    let mul = new Decimal(1)

    return mul
}

function getExpPow() {
    let pow = new Decimal(1)

    pow = pow.add(getExperienceUpgradeEffect(3))
    return pow
}

function getExperience(level) {
    let base = Decimal.sumGeometricSeries(level, 10, 1.02, 0).mul(getExpMultiplier()).pow(getExpPow()).floor().div(100)
    if (player.exp.upgrades[0]) base = base.mul(2)
    base = base.mul(getExperienceUpgradeEffect(2))

    return base
}

function getExperienceHeightBoost() {
    let exp = player.exp.value
    let exp_log_base = new Decimal(10)

    exp_log_base = exp_log_base.sub(getExperienceUpgradeEffect(6))

    let height_exp = new Decimal(0.75)
    return exp.add(1).pow(height_exp).log(exp_log_base).add(1)
}

function resetExp() {
    if (player.level.gte(10)) {
        let pending_exp = getExperience(player.level)
        player.exp.value = player.exp.value.add(pending_exp)
        player.exp.total = player.exp.total.add(pending_exp)
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
        case 3: return new Decimal(player.exp.upgrades[3]).pow_base(10).mul(50);
        case 4: return new Decimal(100)
        case 5: return new Decimal(player.exp.upgrades[5]).mul(20).pow(2.25).round();
        case 6: return new Decimal(1000).mul(player.exp.upgrades[6] + 1)
        case 7: return new Decimal(100000)
        default: console.error("Unknown exp upgrade amount: ", i); return new Decimal(0)
    }
}

function getExperienceUpgradeEffect(i) {
    let base;
    switch (i) {
        case 1: 
        case 2:
            base = new Decimal(0)
            base = base.add(0.05).mul(player.exp.upgrades[i])
            return base.add(1)
        case 3:
            base = new Decimal(0)
            base = base.add(0.02).mul(player.exp.upgrades[i])
            return base
        case 4:
            return player.level.div(1000).add(1)
        case 5:
            base = new Decimal(1)
            base = base.sub(player.exp.upgrades[i] * 0.04)
            return base
        case 6:
            return (0.2 * player.exp.upgrades[i])
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
        if (player.exp.upgrades[i] < STATIC.exp.upg_max[i]) {
            player.exp.value = player.exp.value.sub(getExpUpgradeCost(i))
            player.exp.upgrades[i] += 1
            updateUpgradeBackdrops()
        }
    }

    if (i == 4 && player.unlocks == 2) {
        player.unlocks = 3
        unlock(2) 
    }
    if (i == 7 && player.unlocks == 3) {
        player.unlocks = 4
        unlock(3) 
    }
}

