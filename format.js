const ALERT_NAN = true

function superscript(x) {
    x = Number(x)
    if (typeof x != "number" || x < 0) return undefined
    if (x <= 9) return "⁰¹²³⁴⁵⁶⁷⁸⁹"[x]
    return superscript(String(x)[0]) + superscript(String(x).slice(1))
}

function format(value, neg = false, integer = false) {
    // The old format function was from TMT.
    value = new Decimal(value)

    const PREFIX = ["", "k", "M", "G", "T", "P", "E", "Z", "Y", "R", "Q"]
    const PREFIX_SMALL = ["", "m", "μ", "n", "p", "f", "a", "z", "y", "r", "q"]
    if (value.eq(0)) return "0"
    if (value.isNan()) {
        alert("NaN detected! Gameloop and Saveloop have been stopped. Reload the page or export your file.")
        clearInterval(gameLoop)
        clearInterval(saveLoop)
        return "NaN"
    }

    if (value.gte("eeee10")) {
        return "F" + format(value.slog())
    } else if (value.gte("eee10")) {
        value = value.log10().log10()
        let exp = value.log10().floor()
        let man = value.div(exp.pow_base(10))

        return `10<sup>10<sup>${man.toFixed(2)} × 10${superscript(exp.toString())}</sup></sup>`
    } else if (value.gte("ee10")) {
        value = value.log10()
        let exp = value.log10().floor()
        let man = value.div(exp.pow_base(10))

        return `10<sup>${man.toFixed(2)} × 10${superscript(exp.toString())}</sup>`
    } else if (value.gte("e3000")) {
        let exp = value.log10().floor()
        let man = value.div(exp.pow_base(10))

        return `${man.toFixed(2)} × 10${superscript(exp.toString())}`
    } else if (value.gte(1)) {
        let exp = value.log10().floor()
        let man = value.div(exp.pow_base(10))
        
        let sig = new Decimal(3).sub(exp.mod(3))
        if (value.lt(1000)) {
            return value.toFixed(integer ? 0 : sig)
        } else if (value.lt("1e33")) {
            return `${man.mul(new Decimal(10).pow(exp.mod(3))).toFixed(sig)} ${PREFIX[exp.div(3).floor().toNumber()]}`
        } else if (value.lt("1e300")) {
            return `${man.mul(new Decimal(10).pow(exp.mod(3))).toFixed(sig)} ${PREFIX[exp.div(3).floor().mod(10).toNumber()]}Q${exp.gte(60) ? superscript(exp.div(30).floor().toNumber()) : ""}`
        } else {
            return `${man.mul(new Decimal(10).pow(exp.mod(3))).toFixed(sig)} ${PREFIX[exp.div(3).floor().mod(10).toNumber()]}${exp.mod(300).gte(30) ? "Q" : ""}${exp.mod(300).gte(60) ? superscript(exp.mod(300).div(30).floor().toNumber()) : ""}C${exp.gte(600) ? superscript(exp.div(300).floor().toNumber()) : ""}`
        }
    } else if (value.gte("e-2997")) {
        if (neg) {
            return `(${format(value.recip(), neg, integer)})⁻¹`
        }
        let exp = value.log10().floor()
        let man = value.div(exp.pow_base(10))
        let modded_exp = exp.mod(3).add(3).mod(3)
        
        let sig = new Decimal(3).sub(modded_exp)

        if (value.gt(0.001)) {
            return value.toFixed(integer ? 0 : 3)
        } else if (value.gt("1e-30")) {
            return `${man.mul(new Decimal(10).pow(modded_exp)).toFixed(sig)} ${PREFIX_SMALL[exp.neg().div(3).ceil().toNumber()]}`
        } else if (value.gte("1e-297")) {
            return `${man.mul(new Decimal(10).pow(modded_exp)).toFixed(sig)} ${PREFIX_SMALL[exp.neg().div(3).ceil().mod(10).toNumber()]}q${exp.neg().gte(58) ? superscript(exp.neg().add(2).div(30).floor().toNumber()) : ""}`
        } else {
            return `${man.mul(new Decimal(10).pow(modded_exp)).toFixed(sig)} ${PREFIX_SMALL[exp.neg().div(3).ceil().mod(10).toNumber()]}${exp.neg().add(2).mod(300).gte(30) ? "q" : ""}${exp.neg().add(2).mod(300).gte(60) ? superscript(exp.neg().add(2).div(30).floor().mod(10).toNumber()) : ""}c${exp.neg().gte(598) ? superscript(exp.neg().add(2).div(300).floor().toNumber()) : ""}`
        }
    } else {
        return "blah" // I SWEAR I WILL FINISH CODING THIS LATER
    }
}
