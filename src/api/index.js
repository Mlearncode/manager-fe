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
	getRoleList() {
		return request({
			url: '/role/list',
			method: 'get',
			data: {},
			mock: true,
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
	}
}
