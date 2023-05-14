import { describe, expect, it } from "@jest/globals";
import { isValidDnsAddress } from "../dns.validator";
describe("DnsValidator", () => {
  it("should return false", () => {
    expect(isValidDnsAddress("1.1.1.1.1")).toBeFalsy();
    expect(isValidDnsAddress("1 1 1 1")).toBeFalsy();
    expect(isValidDnsAddress("xx.xx.xx.xx")).toBeFalsy();
  });

  it("should return true", () => {
    expect(isValidDnsAddress("1.1.1.1")).toBeTruthy();
  });
});
