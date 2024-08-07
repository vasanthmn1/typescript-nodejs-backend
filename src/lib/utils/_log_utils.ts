import config from "../../config/config"


export let _logUtils = {
    log: (value: any) => {
        if (!config.live) {
            console.log(value)
        }
    }
}