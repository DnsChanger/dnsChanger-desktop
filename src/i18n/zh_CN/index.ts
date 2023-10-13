import type { Translation } from "../i18n-types";

const eng: Translation = {
  pages: {
    home: {
      homeTitle: "DNS Changer",
      connectedHTML: "连接到 <u>{currentActive}</u>",
      connected: "连接到 {currentActive}",
      disconnected: "已断开连接",
      unknownServer: "连接到未知服务器。",
    },
    settings: {
      title: "设置",
      autoRunningTitle:
        "系统开机时自动执行程序",
      langChanger: "语言更改",
      themeChanger: "主题",
    },
    addCustomDns: {
      NameOfServer: "服务器名称",
      serverAddr: "服务器地址",
    },
  },
  themeChanger: {
    dark: "深色",
    light: "浅色",
  },
  buttons: {
    update: "更新列表",
    favDnsServer: "添加自定义 (DNS) 服务器",
    add: "添加",
    flushDns: "清空",
    ping: "Ping",
  },
  waiting: "请稍候...",
  disconnecting: "正在断开连接...",
  connecting: "正在连接…",
  successful: "成功",
  help_connect: "点击连接",
  help_disconnect: "单击断开连接",
  dialogs: {
    fetching_data_from_repo: "正在从存储库中获取数据...",
    removed_server: "{serverName} 已成功从列表中删除。",
    added_server: "服务器 {serverName} 已成功添加。",
    flush_successful: "清空操作成功。",
    flush_failure: "清空失败。",
  },
  errors: {
    error_fetching_data: "从 {target} 接收数据时出错",
  },
  validator: {
    invalid_dns1: "DNS 值 1 无效。",
    invalid_dns2: "DNS 值 2 无效。",
    dns1_dns2_duplicates: "DNS 1 和 DNS 2 值不能重复。",
  },
  version: "版本",
};

export default zh_CN;
