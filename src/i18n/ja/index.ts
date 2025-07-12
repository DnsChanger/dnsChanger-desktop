import type { Translation } from '../i18n-types'

const ja: Translation = {
	pages: {
		home: {
			homeTitle: 'DNS Changer',
			connectedHTML: '<u>{currentActive}</u> に接続済み',
			connected: '{currentActive} に接続済み',
			disconnected: '切断',
			unknownServer: '不明なサーバーに済み。',
		},
		settings: {
			title: '設定',
			autoRunningTitle:
				'システム起動時にプログラムを自動的に実行',
			langChanger: '言語の変更',
			themeChanger: 'テーマ',
		},
		addCustomDns: {
			NameOfServer: 'サーバー名',
			serverAddr: 'サーバー アドレス',
		},
	},
	themeChanger: {
		dark: 'ダーク',
		light: 'ライト',
	},
	buttons: {
		update: 'リストを更新',
		favDnsServer: 'カスタム(DNS)サーバーの追加',
		add: '追加',
		flushDns: '消去(Flush)',
		ping: 'Ping',
	},
	waiting: 'お待ちください...',
	disconnecting: '切断中...',
	connecting: '接続中...',
	successful: '成功',
	help_connect: 'クリックして接続',
	help_disconnect: 'クリックして切断',
	dialogs: {
		fetching_data_from_repo: 'リポジトリからデータを取得中......',
		removed_server: '{serverName} はリストから正常に削除されました。',
		added_server: 'サーバー {serverName} が正常に追加されました。',
		flush_successful: '消去(Flush)は成功しました。',
		flush_failure: '消去(Flush)に失敗しました。',
	},
	errors: {
		error_fetching_data: '{target} からのデータ受信エラー',
	},
	validator: {
		invalid_dns1: 'DNS 値 1 は無効です。',
		invalid_dns2: 'DNS 値 2 は無効です。',
		dns1_dns2_duplicates: 'DNS 1 と DNS 2 の値は重複できません。',
	},
	version: 'バージョン',
}

export default ja
