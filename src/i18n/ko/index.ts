import type { Translation } from '../i18n-types'

const ko: Translation = {
	pages: {
		home: {
			homeTitle: 'DNS Changer',
			connectedHTML: '<u>{currentActive}</u>에 연결됨',
			connected: '{currentActive}에 연결됨',
			disconnected: '연결이 끊어졌습니다',
			unknownServer: '알 수 없는 서버에 연결되었습니다.',
		},
		settings: {
			title: '설정',
			autoRunningTitle: '시스템이 켜지면 프로그램이 자동으로 실행됩니다',
			langChanger: '언어 변환',
			themeChanger: '테마',
		},
		addCustomDns: {
			NameOfServer: '서버 이름',
			serverAddr: '서버 주소',
		},
	},
	themeChanger: {
		dark: '어두운',
		light: '밝은',
	},
	buttons: {
		update: '목록 업데이트',
		favDnsServer: '사용자 지정 (DNS) 서버 추가',
		add: '추가',
		flushDns: '비우기',
		ping: '핑',
	},
	waiting: '기다려 주세요...',
	disconnecting: '연결을 끊는 중...',
	connecting: '연결을 하는 중...',
	successful: '성공',
	help_connect: '연결하려면 클릭하세요',
	help_disconnect: '연결 해제하려면 클릭하세요',
	dialogs: {
		fetching_data_from_repo: '저장소에서 데이터를 가져오는 중...',
		removed_server: '{serverName}이(가) 목록에서 성공적으로 제거되었습니다.',
		added_server: 'Server {serverName}이(가) 성공적으로 추가되었습니다.',
		flush_successful: '비우기가 성공했습니다.',
		flush_failure: '비우기가 실패했습니다.',
	},
	errors: {
		error_fetching_data: '{target}에서 데이터를 수신하는 중 오류 발생',
	},
	validator: {
		invalid_dns1: 'DNS 값 1은 유효하지 않습니다.',
		invalid_dns2: 'DNS 값 2은 유효하지 않습니다.',
		dns1_dns2_duplicates: 'DNS 1과 DNS 2 값은 중복되지 않아야 합니다.',
	},
	version: '버전',
}

export default ko
