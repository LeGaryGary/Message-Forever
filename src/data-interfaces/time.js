export function GetUnixTime() {
    return Math.floor(new Date().getTime() / 1000)
}