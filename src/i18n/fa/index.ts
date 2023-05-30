import { BaseTranslation } from "../i18n-types";

const fa: BaseTranslation = {
  pages: {
    home: {
      homeTitle: "بهترین های رفع تحریم",
      connectedHTML: "شما به  <u>{currentActive}</u> متصل شدید",
      connected: "شما به  {currentActive} متصل شدید",
      disconnected: "قطع شد.",
      unknownServer: "به یک سرور  ناشناخته متصل هستید.",
    },
    settings: {
      title: "تنظیمات",
      autoRunningTitle: "اجرا شدن خودکار برنامه با روشن شدن سیستم",
      langChanger: "تغییر زبـان",
      themeChanger: "تغییر پوسته",
    },
    addCustomDns: {
      NameOfServer: "نام سرور",
      serverAddr: "آدرس سرور",
    },
  },
  themeChanger: {
    dark: "تاریک",
    light: "روشـن",
  },
  buttons: {
    update: "بروز رسانی لیست",
    favDnsServer: "افزودن سرور (DNS) دلخواه",
    add: "افزودن",
    flushDns: "پاکسازی (Flush)",
    ping: "پیـنگ سرورها",
  },
  dialogs: {
    fetching_data_from_repo: "درحال دریافت دیتا از مخزن",
    added_server: "سرور {serverName} با موفقیت اضافه شد.",
    removed_server: "سرور {serverName} با موفقیت حذف شد.",
    flush_successful: "پاکسازی با موفقیت انجام شد.",
    flush_failure: "پاکسازی ناموفق بود.",
  },
  errors: {
    error_fetching_data: "خطا در دریافت دیتا از {target}",
  },
  connecting: "درحال اتصال...",
  disconnecting: "قطع شدن...",
  waiting: "کمی صبر کنید...",
  successful: "موفقیت آمیز",
  help_connect: "برای اتصال کلیک کنید",
  help_disconnect: "برای قطع اتصال کلیک کنید",
  validator: {
    invalid_dns1: "آدرس سرور 1 نامعتبر است.",
    invalid_dns2: "آدرس سرور 2 نامعتبر است.",
    dns1_dns2_duplicates: "آدرس سرورهای 1 و 2 نباید تکراری باشند.",
  },
  version: "نسخه",
};

export default fa;
