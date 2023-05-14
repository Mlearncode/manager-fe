import { createRouter, createWebHashHistory } from 'vue-router'
import storage from '../utils/storage'
import api from '../api'
import util from '../utils/toolUtils'

const routes = [
	{
		name: 'home',
		path: '/',
		meta: {
			title: '首页',
		},
		component: () => import('@/components/Home.vue'),
		redirect: '/welcome',
		children: [
			{
				name: 'welcome',
				path: '/welcome',
				component: () => import('@/views/Welcome.vue'),
			},
			{
				name: 'menu',
				path: '/sys/menu',
				component: () => import('@/views/Menu.vue'),
			},
		],
	},
	{
		name: 'login',
		path: '/login',
		meta: {
			title: '登录',
		},
		component: () => import('@/views/Login.vue'),
	},
	{
		name: '404',
		path: '/404',
		meta: {
			title: '页面不存在',
		},
		component: () => import('@/views/404.vue'),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

async function loadAsyncRoutes() {
	let userInfo = storage.getItem('userInfo') || {}
	if (userInfo.token) {
		try {
			const { menuList } = await api.getUserPermission()
			let routes = util.generateRoute(menuList)
			routes.map((route) => {
				let url = `./../views/${route.component}.vue`
				route.component = () => import(url)
				router.addRoute('home', route)
			})
			console.log(routes);
		} catch (error) {
			console.log(error)
		}
	}
}

await loadAsyncRoutes()

//导航守卫
router.beforeEach((to, from, next) => {
	if (checkPermission(to.path)) {
		document.title = to.meta.title
		next()
	} else {
		next('/404')
	}
})

function checkPermission(path) {
	let hasPermission = router
		.getRoutes()
		.filter((route) => route.path == path).length
	if (hasPermission) {
		return true
	}
	return false
}

export default router
