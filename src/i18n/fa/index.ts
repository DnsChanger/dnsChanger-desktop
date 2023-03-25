import type { Translation } from '../i18n-types';
const fa: Translation = {
    pages: {
        home: {
            hometitle: "بهترین های رفع تحریم",
            connected: "شما به  <u>{currentActive}</u> متصل شدید",
            annonumos: "به یک سرور  ناشناخته متصل هستید.",
        },
        settings: {
            title: "تنظیمات",
            autorunningTitle: "اجرا شدن خودکار برنامه با روشن شدن سیستم"
        },
        addfavDnspage: {
            "NameOfServer": "نام سرور",
            "ipserivce": "آدرس سرور"
        }
    },
    buttons: {
        update: "بروز رسانی لیست",
        favDnsServer: "افزودن سرور (DNS) دلخواه",
        add: "افزودن"
    },
    dialogs: {
        fetching_data_from_repo: "درحال دریافت دیتا از مخزن",
    },
    errors: {
        error_fetchig_data: "خطا در دریافت دیتا از {target}",
    },
    waiting: "کمی صبر کنید..."
}

export default fa
