import type { Translation } from '../i18n-types'

const ara: Translation = {
  pages: {
    home: {
      homeTitle: 'مغير DNS',
      connectedHTML: 'متصل بـ <u>{currentActive}</u>',
      connected: 'متصل بـ {currentActive}',
      disconnected: 'غير متصل',
      unknownServer: 'متصل بخادم غير معروف.'
    },
    settings: {
      title: 'الإعدادات',
      autoRunningTitle: 'التشغيل التلقائي للبرنامج عند تشغيل النظام',
      langChanger: 'تغيير اللغة',
      themeChanger: 'المظهر'
    },
    addCustomDns: {
      NameOfServer: 'اسم الخادم',
      serverAddr: 'عنوان الخادم'
    }
  },
  themeChanger: {
    dark: 'داكن',
    light: 'فاتح'
  },
  buttons: {
    update: 'تحديث القائمة',
    favDnsServer: 'إضافة خادم (DNS) مخصص',
    add: 'إضافة',
    flushDns: 'إفراغ',
    ping: 'بينغ'
  },
  waiting: 'يرجى الانتظار...',
  disconnecting: 'جاري قطع الاتصال...',
  connecting: 'جاري الاتصال...',
  successful: 'ناجح',
  help_connect: 'انقر للاتصال',
  help_disconnect: 'انقر لقطع الاتصال',
  dialogs: {
    fetching_data_from_repo: 'جاري جلب البيانات من المستودع...',
    removed_server: '{serverName} تمت إزالته بنجاح من القائمة.',
    added_server: 'الخادم {serverName} تمت إضافته بنجاح.',
    flush_successful: 'تم الإفراغ بنجاح.',
    flush_failure: 'فشل الإفراغ.'
  },
  errors: {
    error_fetching_data: 'خطأ في استلام البيانات من {target}'
  },
  validator: {
    invalid_dns1: 'قيمة DNS 1 غير صالحة.',
    invalid_dns2: 'قيمة DNS 2 غير صالحة.',
    dns1_dns2_duplicates: 'يجب ألا تكون قيم DNS 1 و DNS 2 مكررة.'
  },
  version: 'الإصدار'
}

export default ara
