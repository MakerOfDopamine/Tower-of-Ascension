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

setInterval(() => {
    save()
    console.log("saved")
}, 10000)