function getMagicMultiplier() {
    let mul = new Decimal(1)

    return mul
}

function getMagicPow() {
    let pow = new Decimal(1)

    return pow
}

function getMagicResetAmount() {
    let base = player.exp.value.div(1e5).pow(0.75)
    base = base.mul(getMagicMultiplier())
    base = base.pow(getMagicPow())

    base = base.max(1)
    if (player.exp.upgrades[7] == false) base = new Decimal(0)
    
    return base.round()
}

function getPrayersMagicReset() {
    let base = new Decimal(1)

    return base.round()
}

function resetMagic() {
    let pending_magic = getMagicResetAmount()
    if (player.exp.total.gte(1e5) && pending_magic.gt(0)) {
        resetExp()
        player.magic.value = player.magic.value.add(pending_magic)
        player.magic.total = player.magic.total.add(pending_magic)
        player.magic.prayers.value = player.magic.prayers.value.add(getPrayersMagicReset())
        player.magic.prayers.total = player.magic.prayers.total.add(getPrayersMagicReset())

        player.magic.beast.power = new Decimal(0)
        player.exp.total = new Decimal(0)
        player.exp.value = new Decimal(0)
        player.exp.upgrades = distinct(default_player.exp.upgrades)
        player.level = new Decimal(1)
        player.height = new Decimal(0)
        if (player.unlocks == 4) player.unlocks = 5
        unlock(4)
    }
}

function getBeastPerSecond() {
    let base = new Decimal(0)

    base = base.add(new Decimal(2).mul(player.magic.beast.producers[0]))
    base = base.mul(getShrineFavor(2))

    return base
}

function getBeastHeightBoost() {
    return player.magic.beast.power.max(0).div(5).pow(0.5)
}

function getBeastProducerCost(i) {
    switch (i) {
        case 0: return new Decimal(1).mul(new Decimal(1.5).pow(player.magic.beast.producers[0])).round()
    }
}

function buyBeastProducer(i) {
    let cost = getBeastProducerCost(i)
    if (player.magic.value.lt(cost)) return;
    player.magic.value = player.magic.value.sub(cost)
    player.magic.beast.producers[i] += 1

    return;
}

function getShrineFavor(i) {
    switch (i) {
        case 0: return player.magic.prayers.spent[0].div(20).add(1).log10().add(1).log10().add(1);
        case 1: return player.magic.prayers.spent[1].div(10).add(1).pow(0.15);
        case 2: return player.magic.prayers.spent[2].div(3).add(1).pow(0.75);
        case 3: return player.magic.prayers.spent[3].add(1).pow(0.5);
    }
}

function prayToShrine(i) {
    if (player.magic.prayers.value.lt(1)) return
    player.magic.prayers.value = player.magic.prayers.value.sub(1)
    player.magic.prayers.spent[i] = player.magic.prayers.spent[i].add(1)
}