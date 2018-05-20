export default (x, y) => {
    const a = Math.max(x, y)
    const b = Math.min(x, y)

    return Number(`${b}${a}`)
}

export const decode = (res, a) => {
    if (String(res).includes(String(a))) {
        return String(res).split(String(a)).filter(Boolean)[0]
    }

    return false
}
