import {WindowsPlatform} from "../windows.platform";
import {Interface} from "../interfaces/interface";

describe('WinPlatform()', function () {
    let windowsPlatform: WindowsPlatform;

    beforeEach(() => {
        windowsPlatform = new WindowsPlatform()
    })

    it("should return '1.1.1.1' for active server", function () {
        const currentServer: Array<string> = ["1.1.1.1", "1.1.1.1"]

        jest.spyOn(WindowsPlatform.prototype as any, "extractDns")
            .mockImplementation(() => currentServer)

        const activeInterface: Interface = {
            name: "",
            gateway_ip: "",
            ip_address: "",
            model: "",
            type: "",
            vendor: "",
            netmask: "",
            mac_address: ""
        }
        jest.spyOn(WindowsPlatform.prototype as any, "getValidateInterface")
            .mockImplementation(() => activeInterface)

        jest.spyOn(WindowsPlatform.prototype as any, "execCmd")
            .mockImplementation(() => "")

        expect(windowsPlatform.getActiveDns())
            .resolves.toBe(currentServer)
    });


    describe('SetDns', function () {

        it('should called execCmd', async function () {
            const validatedInterface = {
                name: "xx"
            } as any
            jest.spyOn(WindowsPlatform.prototype as any, "getValidateInterface")
                .mockImplementation(() => validatedInterface)

            jest.spyOn(WindowsPlatform.prototype as any, "execCmd")
                .mockImplementation()

            await windowsPlatform.setDns(["1.1.1.1", "1.1.1.1"])

            // @ts-ignore
            expect(WindowsPlatform.prototype.execCmd).toHaveBeenCalledTimes(2)
        });

        it('should called once execCmd', async function () {
            const validatedInterface = {
                name: "xx"
            } as any
            jest.spyOn(WindowsPlatform.prototype as any, "getValidateInterface")
                .mockImplementation(() => validatedInterface)

            jest.spyOn(WindowsPlatform.prototype as any, "execCmd")
                .mockImplementation()

            await windowsPlatform.setDns(["1.1.1.1"])

            // @ts-ignore
            expect(WindowsPlatform.prototype.execCmd).toHaveBeenCalledTimes(1)
        });

    });
});
