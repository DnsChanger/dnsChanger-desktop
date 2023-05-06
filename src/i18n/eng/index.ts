import type { Translation } from '../i18n-types';

const eng: Translation = {
    pages: {
        home: {
            homeTitle: "DNS Changer",
            connectedHTML: 'Connected to <u>{currentActive}</u>',
            connected: "Connected to {currentActive}",
            disconnected: "Disconnected",
            unknownServer: "connected to an unknown server.",
        },
        settings: {
            title: "Settings",
            autoRunningTitle: "Automatic execution of the program when the system is turned on",
            langChanger: "Language Changer"
        },
        addCustomDns: {
            NameOfServer: "Server name",
            serverAddr: "Server address"
        }
    },
    buttons: {
        update: "Update the list",
        favDnsServer: "Adding a custom (DNS) server",
        add: "Add"
    },
    waiting: "Please wait...",
    disconnecting: "disconnecting...",
    connecting: "connecting...",
    successful: "successful",
    help_connect: "Click to connect",
    help_disconnect: "Click to disconnect",
    dialogs: {
        fetching_data_from_repo: "fetching data from repository...",
        removed_server: "{serverName} was successfully removed from the list.",
        added_server: "Server {serverName} successfully added."
    },
    errors: {
        error_fetching_data: "Error in receiving data from the {target}"
    },
    validator: {
        invalid_dns1: "DNS value 1 is not valid.",
        invalid_dns2: "DNS value 2 is not valid.",
        dns1_dns2_duplicates: "DNS 1 and DNS 2 values must not be duplicates."
    }
}

export default eng
