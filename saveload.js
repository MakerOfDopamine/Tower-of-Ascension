function decimalise(obj) {
    if (Array.isArray(obj)) {
        for (let i in obj) {
            obj[i] = decimalise(obj[i])
        }
        return obj
    } else if (typeof obj == "object") {
        let k = Object.keys(obj)
        for (let i in k) {
            obj[k[i]] = decimalise(obj[k[i]])
        }
        return obj
    } else if (typeof obj == "string") {
        let attempt = new Decimal(obj)
        if (attempt.eq(Decimal.dZero)) {
            if (obj == "0") {
                return attempt
            } else {
                // Object is not a valid decimal
                return obj
            }
        } else {
            if (attempt.isNan()) {
                return obj
            }
            return attempt
        }
    } else {
        return obj
    }
}

function save() {
    let save_data = btoa(JSON.stringify(player))
    localStorage.setItem("toa", save_data)
}

function load() {
    let save_data = localStorage.getItem("toa")
    if (save_data != null) {
        let decrypted_save_data = JSON.parse(atob(save_data))
        player = decimalise(decrypted_save_data)
        validate_save()
        save()
        return true
    } else {
        return false
    }
}

function reset_everything(noprompt) {
    if (!noprompt) {
        if (!confirm("Really hard reset? This gives no bonuses.")) return
        if (!confirm("REALLY hard reset? This will not unlock anything.")) return
    }

    localStorage.removeItem("toa")
    document.location.reload()
}

function validate_save() {
    player.version ??= "indev" // I love ??= (the code is confused about your version)

    // Fixes regardless of version
    if (player.exp.upgrades.length < STATIC.exp.upg_max.length) {
        for (let i = player.exp.upgrades.length; i < STATIC.exp.upg_max.length; i++) {
            player.exp.upgrades.push(STATIC.exp.upg_max[i] == 0 ? false : 0)
        }
    }
    
    // Fixes by version
    // (for example if i accidentally Mess Up and inflate to 1e10000)
    if (player.version != default_player.version) {
        switch (player.version) {
            // The lack of break statments here is so that every case runs every other case underneath it and 
            // every case has what was fixed in that version only
            case "indev":
                //alert("welcome from the old dev era")
                player.version = "indev_2"
            case "indev_2":
                player.lastTick = Date.now()
                console.log("Updated save from indev_2 => indev_3")
                player.version = "indev_3"
        }
    }
}
