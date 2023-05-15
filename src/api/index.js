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
//user
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
	userSubmit(params) {
		return request({
			url: '/users/operate',
			method: 'post',
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
	getUserPermission(params) {
		return request({
			url: '/users/getPermission',
			method: 'get',
			data: {}
		})
	},

//role
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
	},

	//dept
	getDeptList(params) {
		return request({
			url: '/dept/list',
			method: 'get',
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

	//menu
	getmenuList(params) {
		return request({
			url: '/menu/list',
			method: 'get',
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

	//leave
	noticeCount(params) {
		return request({
			url: '/leave/count',
			method: 'get',
			data: {},
		})
	},
	getApplyList(params) {
		return request({
			url: '/leave/list',
			method: 'get',
			data: params,
		})
	},
	leaveSubmit(params) {
		return request({
			url: '/leave/operate',
			method: 'post',
			data: params,
		})
	}
}
