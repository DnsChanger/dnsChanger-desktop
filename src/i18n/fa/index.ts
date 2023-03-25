import {BaseTranslation} from "../i18n-types";

const fa: BaseTranslation = {
    pages: {
        home: {
            homeTitle: "بهترین های رفع تحریم",
            connected: "شما به  <u>{currentActive}</u> متصل شدید",
            unknownServer: "به یک سرور  ناشناخته متصل هستید.",
        },
        settings: {
            title: "تنظیمات",
            autoRunningTitle: "اجرا شدن خودکار برنامه با روشن شدن سیستم",
            langChanger: "تغییر زبـان"
        },
        addCustomDns: {
            NameOfServer: "نام سرور",
            serverAddr: "آدرس سرور"
        }
    },
    buttons: {
        update: "بروز رسانی لیست",
        favDnsServer: "افزودن سرور (DNS) دلخواه",
        add: "افزودن"
    },
    dialogs: {
        fetching_data_from_repo: "درحال دریافت دیتا از مخزن",
        added_server: "سرور {serverName} با موفقیت اضافه شد.",
        removed_server: "سرور {serverName} با موفقیت حذف شد."
    },
    errors: {
        error_fetching_data: "خطا در دریافت دیتا از {target}",
    },
    connecting: "درحال اتصال...",
    disconnecting: "قطع شدن...",
    waiting: "کمی صبر کنید...",
    successful: "موفقیت آمیز",
    validator: {
        invalid_dns1: "آدرس سرور 1 نامعتبر است.",
        invalid_dns2: "آدرس سرور 2 نامعتبر است.",
        dns1_dns2_duplicates: "آدرس سرورهای 1 و 2 نباید تکراری باشند."
    }
}

export default fa
