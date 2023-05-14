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
			url: '/leave/count',
			method: 'get',
			data: {},
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
	getAllUserList() {
		return request({
			url: '/users/all/list',
			method: 'get',
			data: {},
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
	getDeptList(params) {
		return request({
			url: '/dept/list',
			method: 'get',
			data: params,
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
	deptSubmit(params) {
		return request({
			url: '/dept/operate',
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
	},
	getUserPermission(params) {
		return request({
			url: '/users/getPermission',
			method: 'get',
			data: {}
		})
	},
}
