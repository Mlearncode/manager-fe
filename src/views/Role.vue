<template>
	<div class="role-manager">
		<div class="query-form">
			<el-form
				ref="form"
				:inline="true"
				:model="queryForm"
			>
				<el-form-item
					label="角色名称"
					prop="roleName"
				>
					<el-input
						v-model="queryForm.roleName"
						placeholder="请输入角色名称"
					/>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="handleQuery"
						>查询</el-button
					>
					<el-button
						type="danger"
						@click="handleReset('form')"
						>重置</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<div class="base-table">
			<div class="action">
				<el-button
					type="primary"
					@click="handleAdd"
					>创建</el-button
				>
			</div>
			<el-table :data="roleList">
				<el-table-column
					v-for="item in columns"
					:key="item.prop"
					:prop="item.prop"
					:label="item.label"
					:width="item.width"
					:formatter="item.formatter"
				/>
				<el-table-column
					fixed="right"
					label="操作"
					width="250"
				>
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							@click="handleEdit(scope.row)"
							>编辑</el-button
						>
						<el-button
							type="primary"
							size="small"
							@click="handleOpenPermission(scope.row)"
							>设置权限</el-button
						>
						<el-button
							type="danger"
							size="small"
							@click="handleDel(scope.row._id)"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				class="pagination"
				@current-change="handleCurrentChange"
				:page-size="pager.size"
				background
				layout="prev, pager, next"
				:total="Number(pager.total)"
			/>
		</div>
		<el-dialog
			:title="action == 'create' ? '创建角色' : '编辑角色'"
			v-model="dialogVisible"
		>
			<el-form
				ref="dialogForm"
				:model="roleForm"
				label-width="100px"
				:rules="rules"
			>
				<el-form-item
					label="角色名称"
					prop="roleName"
				>
					<el-input
						v-model="roleForm.roleName"
						placeholder="请输入角色名称"
					/>
				</el-form-item>
				<el-form-item
					label="备注"
					prop="remark"
				>
					<el-input
						type="textarea"
						:row="2"
						v-model="roleForm.remark"
						placeholder="请输入备注"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="handleClose">取消</el-button>
					<el-button
						type="primary"
						@click="handleSubmit"
					>
						确定
					</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 权限弹窗 -->
		<el-dialog
			title="权限设置"
			v-model="showPermission"
		>
			<el-form
				label-width="100px"
				:rules="rules"
			>
				<el-form-item
					label="角色名称"
					prop="roleName"
				>
					{{ curRoleName }}
				</el-form-item>
				<el-form-item label="选择权限">
					<el-tree
						ref="permissionTree"
						:data="menuList"
						show-checkbox
						default-expand-all
						node-key="_id"
						:props="{ label: 'menuName' }"
					></el-tree>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="showPermission = false">取消</el-button>
					<el-button
						type="primary"
						@click="handlePermissionSubmit"
					>
						确定
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import util from '@/utils/toolUtils'
export default {
	name: 'Role',
	data() {
		return {
			//权限认证
			showPermission: false,
			curRoleName: '',
			curRoleId: '',
			dialogVisible: false,
			action: '',
			queryForm: {
				roleName: "",
			},
			menuList: [],
			roleList: [],
			columns: [
				{
					label: '角色名称',
					prop: 'roleName',
					width: 150,
				},
				{
					label: '备注',
					prop: 'remark',
				},
				{
					label: '权限列表',
					width: 200,
					prop: 'permissionList',
					formatter: (row, column, val) => {
						let names = []
						let list = val.halfCheckedKeys || []
						list.map(key => {
							let name = this.actionMap[key];
              if (key && name) names.push(name);
            });
            return names.join(",")
					}
				},
				{
					label: '更新时间',
					prop: 'updateTime',
					formatter(row, column, val) {
						return util.formateDate(new Date(val))
					},
				},
				{
					label: '创建时间',
					prop: 'createTime',
					formatter(row, column, val) {
						return util.formateDate(new Date(val))
					},
				},
			],
			pager: {
				total: 0,
				pageNum: 1,
				pageSize: 10,
			},
			roleForm: {},
			rules: {
				roleName: [
					{
						required: true,
						message: '请输入角色名称',
					},
				],
			},
			//菜单映射表
			actionMap:{}
		}
	},
	mounted() {
		this.getRoleList()
		this.getMenuList()
	},
	methods: {
		//角色列表初始化
		async getRoleList() {
			try {
				let { list, page } = await this.$api.getroleList({ ...this.queryForm, ...this.pager })
				this.roleList = list
				this.pager.total = page.total
			} catch (error) {
				throw new Error(error)
			}
		},
		//菜单列表
		async getMenuList() {
			try {
				let list = await this.$api.getmenuList()
				this.menuList = list
				this.getActionMap(list)
			} catch (error) {
				throw new Error(error)
			}
		},
		handleCurrentChange(cur) {
			this.pager.pageNum = cur
			this.getRoleList()
		},
		handleAdd() {
			this.action = 'create'
			this.dialogVisible = true
		},
		handleEdit(row) {
			this.action = 'edit'
			this.dialogVisible = true
			this.$nextTick(() => {
				Object.assign(this.roleForm, { _id:row._id, roleName: row.roleName, remark: row.remark})
			})
		},
		handleQuery() {
			this.getRoleList()
		},
		handleReset(form) {
			this.$refs[form].resetFields()
		},
		async handleDel(_id) {
			await this.$api.roleSubmit({ _id, action: 'delete' })
			this.$message.success('删除成功')
			this.getRoleList()
		},
		handleSubmit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					let { action, roleForm } = this
					let params = {
						...roleForm,
						action,
					}
					let res = await this.$api.roleSubmit(params)
					if (res) {
						this.dialogVisible = false
						action == 'create'
							? this.$message.success('创建成功')
							: this.$message.success('修改成功')
						this.handleReset('dialogForm')
						this.getRoleList()
					}
				}
			})
		},
		handleOpenPermission(row) {
			this.curRoleId = row._id
			this.curRoleName = row.roleName
			this.showPermission = true
			let { checkedKeys } = row.permissionList
			setTimeout(() => {
				this.$refs.permissionTree.setCheckedKeys(checkedKeys)
			})
		},
		async handlePermissionSubmit() {
			let nodes = this.$refs.permissionTree.getCheckedNodes()
			let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys()
			let checkedKeys = []
			let parentKeys = []
			nodes.map((node) => {
				if (!node.children) {
					checkedKeys.push(node._id)
				} else {
					parentKeys.push(node._id)
				}
			})
			let params = {
				_id: this.curRoleId,
				permissionList: {
					checkedKeys,
					halfCheckedKeys: parentKeys.concat(halfKeys)
				}
			}
			await this.$api.updatePermission(params)
			this.showPermission = false
			this.$message.success('设置成功')
			this.getRoleList()
		},
		handleClose() {
			this.dialogVisible = false
			this.handleReset('dialogForm')
		},
		getActionMap(list) {
			let actionMap = {}
			const deep = (arr) => {
				while (arr.length) {
					let item = arr.pop()
					if (item.children && item.action) {
						actionMap[item._id]  = item.menuName
					}
					if (item.children && !item.action) {
						deep(item.children)
					}
				}
			}
			deep(JSON.parse(JSON.stringify(list)))
			this.actionMap = actionMap
		}
	},
}
</script>

<style lang="scss"></style>
