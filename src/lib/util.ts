
export function isNumeric(num: any) {
    return !isNaN(num)
}

export function convertIfNumberic(num: any) {
    return isNumeric(num) ? +num : num;
}
