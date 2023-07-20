import { isIPv4 } from 'net';
export function isValidDnsAddress(value: string) {
  return isIPv4(value)
}
