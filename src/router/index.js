import { createRouter, createWebHashHistory } from 'vue-router'

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
				name: 'user',
				path: '/sys/user',
				meta: {
					title: '用户管理',
				},
				component: () => import('@/views/User.vue'),
			},
			{
				name: 'menu',
				path: '/sys/menu',
				meta: {
					title: '菜单管理',
				},
				component: () => import('@/views/Menu.vue'),
			},
			{
				name: 'role',
				path: '/sys/role',
				meta: {
					title: '角色管理',
				},
				component: () => import('@/views/Role.vue'),
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
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
