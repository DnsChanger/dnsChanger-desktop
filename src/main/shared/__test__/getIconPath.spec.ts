import { getIconPath } from "../getIconPath";

describe("getIconPath()", () => {
  it("should return 'win32' path", () => {
    Object.defineProperty(process, "platform", {
      value: "win32",
    });

    expect(getIconPath()).toMatch(/\\src\\main\\shared\\assets\\icon.ico/);
  });
  it("should return 'darwin' path", () => {
    Object.defineProperty(process, "platform", {
      value: "darwin",
    });

    expect(getIconPath()).toMatch(/\\src\\main\\shared\\assets\\icon.ico/);
  });
  it("should return 'linux' path", () => {
    Object.defineProperty(process, "platform", {
      value: "linux",
    });

    expect(getIconPath()).toMatch(/\\src\\main\\shared\\assets\\icon.png/);
  });
});
