/**
 * 环境配置
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
	dev: {
		baseApi: '/api',
		mockApi:
			'https://www.fastmock.site/mock/2f1f035ec67d7bdd776f6a623b506aee/api',
	},
	test: {
		baseApi: '/',
		mockApi:
			'https://www.fastmock.site/mock/2f1f035ec67d7bdd776f6a623b506aee/api',
	},
	prod: {
		baseApi: '/',
		mockApi:
			'https://www.fastmock.site/mock/2f1f035ec67d7bdd776f6a623b506aee/api',
	},
}
export default {
	env,
	mock:true,
	namespace: 'manager',
	...EnvConfig[env],
}
