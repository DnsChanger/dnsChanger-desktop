import type { Translation } from "../i18n-types";

const it: Translation = {
  pages: {
    home: {
      homeTitle: "DNS Changer",
      connectedHTML: "Connesso a <u>{currentActive}</u>",
      connected: "Connesso a {currentActive}",
      disconnected: "Disconnesso",
      unknownServer: "connesso ad un server sconosciuto.",
    },
    settings: {
      title: "Impostazioni",
      autoRunningTitle:
        "Esegui automaticamente il programma all'avvio del sistema",
      langChanger: "Lingua interfaccia",
      themeChanger: "Tema",
    },
    addCustomDns: {
      NameOfServer: "Nome server",
      serverAddr: "Indirizzo server",
    },
  },
  themeChanger: {
    dark: "Chiaro",
    light: "Scuro",
  },
  buttons: {
    update: "Aggiorna elenco",
    favDnsServer: "Aggiungi server (DNS) personalizzato",
    add: "Aggiungi",
    flushDns: "Flush",
    ping: "Ping",
  },
  waiting: "Attendi...",
  disconnecting: "disconnessione...",
  connecting: "connessione...",
  successful: "completato",
  help_connect: "Clic per connetterti",
  help_disconnect: "Clic per disconnetterti",
  dialogs: {
    fetching_data_from_repo: "recupero dati dal repository...",
    removed_server: "{serverName} è stato correttamente rimosso dall'elenco.",
    added_server: "Server {serverName} aggiunto correttamente all'elenco.",
    flush_successful: "Flush effettuato correttamente.",
    flush_failure: "Flush fallito.",
  },
  errors: {
    error_fetching_data: "Errore nella ricezione dei dati da {target}",
  },
  validator: {
    invalid_dns1: "Il valore DNS 1 non è valido.",
    invalid_dns2: "Il valore DNS 2 non è valido.",
    dns1_dns2_duplicates: "I valori DNS 1 e DNS 2 non devono essere duplicati.",
  },
  version: "versione",
};

export default it;
