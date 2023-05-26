import { BaseTranslation, Translation } from "../i18n-types";

const ru: Translation = {
  pages: {
    home: {
      homeTitle: "Лучшее снятие санкций",
      connectedHTML: "Вы подключены к <u>{currentActive}</u> ",
      connected: "Вы подключены к {currentActive}",
      disconnected: "Прервано",
      unknownServer: "Вы подключены к неизвестному серверу",
    },
    settings: {
      title: "Настройки",
      autoRunningTitle:
        "Автоматическое выполнение программы при включении системы",
      langChanger: "Изменить язык",
      themeChanger: "менять тему",
    },
    addCustomDns: {
      NameOfServer: "имя сервера",
      serverAddr: "адрес сервера",
    },
  },
  themeChanger: {
    dark: "темный",
    light: "свет",
  },
  buttons: {
    update: "список обновлений",
    favDnsServer: "добавить собственный (DNS) сервер",
    add: "добавлять",
    flushDns: "очистить (Flush)",
    ping: "серверы пингуются",
  },
  dialogs: {
    fetching_data_from_repo: "получение данных из репозитория",
    added_server: "{serverName} сервер успешно добавлен",
    removed_server: "{serverName} сервер успешно удален",
    flush_successful: "очистка успешно завершена",
    flush_failure: "очистка не удалась",
  },
  errors: {
    error_fetching_data: "Ошибка при получении данных от {target}",
  },
  connecting: "подключение...",
  disconnecting: "отключение...",
  waiting: "пожалуйста, подождите...",
  successful: "успешный",
  help_connect: "нажмите, чтобы подключиться",
  help_disconnect: "нажмите, чтобы отключить",
  validator: {
    invalid_dns1: "DNS-значение 1 недопустимо.",
    invalid_dns2: "DNS-значение 2 недопустимо.",
    dns1_dns2_duplicates: "Значения DNS 1 и DNS 2 не должны совпадать.",
  },
  version: "версия",
};

export default ru;
