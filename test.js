var network = require('network');

const sudo = require('sudo-prompt');
const fs = require("fs/promises")

function getInterfacesList() {
    return new Promise((resolve, reject) => {
        network.get_interfaces_list((err, obj) => {
            if (err) reject(err)
            else resolve(obj)
        })
    })
}


// (async () => {
//     const interfaces = await getInterfacesList();
//     const activeInterface = interfaces.find((inter) => inter.gateway_ip != null)
//     const result = await getActiveDns(activeInterface.name)
//     console.log(extractDns(result))
//     // await setDns(activeInterface.name, '78.157.42.100')
//     // await setDns(activeInterface.name, "78.157.42.101", true)
//     // await clearDns(activeInterface.name)
//     console.log("Done")
// })();

async function setDns(interfaceName, server, setIndex2 = false) {
    const options = {
        name: 'DnsChanger',
    };
    let index = ''
    if (!setIndex2)
        index = `index=2`
    let cmd = `netsh interface ip set dns "${interfaceName}" static ${server}`
    if (setIndex2)
        cmd = `netsh interface ip add dns "${interfaceName}" ${server} index=2`
    return new Promise((resolve, reject) => {
        sudo.exec(cmd, options, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(true)
        });
    })
}

function clearDns(interfaceName) {
    return new Promise((resolve, reject) => {
        sudo.exec(`netsh interface ip set dns  "${interfaceName}" dhcp`, {
            name: "test"
        }, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(true)
        });
    })
}


function getActiveDns(interfaceName) {
    return new Promise((resolve, reject) => {
        sudo.exec(`netsh interface ip show dns "${interfaceName}"`, {
            name: "test"
        }, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(stdout)
        });
    })
}

async function fileAccessLinux() {
    await fs.access("/etc/resolv.conf", fs.constants.R_OK | fs.constants.W_OK)
}
fileAccessLinux()