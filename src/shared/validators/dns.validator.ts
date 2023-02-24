export function isValidDnsAddress(value: string) {
    const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return regex.test(value);
    //ChatGpt
}
