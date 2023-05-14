/**
 * api管理
 */
import request from './../utils/request'
export default {
	login(params) {
		return request({
			url: '/users/login',
			method: 'post',
			data: params,
		})
	},
	noticeCount(params) {
		return request({
			url: '/menu/list',
			method: 'get',
			data: {},
			mock: true,
		})
	},
	getmenuList(params) {
		return request({
			url: '/menu/list',
			method: 'get',
			data: params,
		})
	},
	getuserList(params) {
		return request({
			url: '/users/list',
			method: 'get',
			data: params,
		})
	},
	userDel(params) {
		return request({
			url: '/users/delete',
			method: 'post',
			data: params,
		})
	},
	getRoleAllList() {
		return request({
			url: '/roles/allList',
			method: 'get',
			data: {},
		})
	},
	getroleList(params) {
		return request({
			url: '/roles/list',
			method: 'get',
			data: params,
		})
	},
	getDeptList() {
		return request({
			url: '/dept/list',
			method: 'get',
			data: {},
			mock: true,
		})
	},
	userSubmit(params) {
		return request({
			url: '/users/operate',
			method: 'post',
			data: params,
		})
	},
	menuSubmit(params) {
		return request({
			url: '/menu/operate',
			method: 'post',
			data: params,
		})
	},
	roleSubmit(params) {
		return request({
			url: '/roles/operate',
			method: 'post',
			data: params,
		})
	},
	updatePermission(params) {
		return request({
			url: '/roles/update/permission',
			method: 'post',
			data: params
		})
	}
}
