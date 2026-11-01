function getManaMultiplier() {
    let mul = new Decimal(1)

    return mul
}

function getManaPow() {
    let pow = new Decimal(1)

    return pow
}

function resetMagic() {
    if (player.exp.total.gte(1e5)) {
        let pending_magic = player.exp.value.div(1e5).pow(0.75).max(1).round()
        resetExp()
        player.magic
        player.exp.total = new Decimal(0)
        player.exp.value = new Decimal(0)
        player.level = new Decimal(1)
        player.height = new Decimal(0)
        if (player.unlocks == 4) player.unlocks = 5
        unlock(4)
    }
}