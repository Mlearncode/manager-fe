<template>
	<div class="approve-manager">
		<div class="query-form">
			<query-form :form="form" v-model="queryForm" @handleQuery="handleQuery"></query-form>
		</div>
		<div class="base-table">
			<div class="action"></div>
			<el-table
				:data="applyList"
			>
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
					width="180"
				>
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							@click="handleDetail(scope.row)"
							v-if="
								scope.row.curAuditUserName == userInfo.userName &&
								[1, 2].includes(scope.row.applyState)
							"
							>审核</el-button
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
				v-if="pager.total > 0"
			/>
		</div>
		<el-dialog
			title="审核"
			width="50%"
			v-model="detailVisible"
			destroy-on-close
		>
			<el-form
				label-width="100px"
				ref="dialogForm"
				:model="auditForm"
				label-suffix=":"
				:rules="rules"
			>
				<el-form-item label="申请人">
					<div>{{ detailForm.applyUser.userName }}</div>
				</el-form-item>
				<el-form-item label="休假类型">
					<div>{{ detailForm.applyTypeName }}</div>
				</el-form-item>
				<el-form-item label="休假时间">
					<div>{{ detailForm.time }}</div>
				</el-form-item>
				<el-form-item label="休假时长">
					<div>{{ detailForm.leaveTime }}</div>
				</el-form-item>
				<el-form-item label="休假原因">
					<div>{{ detailForm.reasons }}</div>
				</el-form-item>
				<el-form-item label="审批状态">
					<div>{{ detailForm.applyStateName }}</div>
				</el-form-item>
				<el-form-item label="审批人">
					<div>{{ detailForm.curAuditUserName }}</div>
				</el-form-item>
				<el-form-item
					label="备注"
					prop="remark"
				>
					<el-input
						type="textarea"
						:rows="3"
						placeholder="请输入审核备注"
						v-model="auditForm.remark"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button
						type="danger"
						@click="handleApprove('refuse')"
						>驳回</el-button
					>
					<el-button
						type="primary"
						@click="handleApprove('pass')"
						>审核通过</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { getCurrentInstance, onMounted, ref, reactive, toRaw } from 'vue'
import util from '@/utils/toolUtils'
export default {
	name: 'Approve',
	setup() {
		const { proxy } = getCurrentInstance()
		const queryForm = reactive({
			applyState: 1,
		})
		const form = [
			{
				type: 'select',
				label: "审批状态",
				model: 'applyState',
				placeholder: "请选择状态",
				options: [
					{
						label: "全部",
						value: 0
					},
					{
						label: "待审批",
						value: 1
					},
					{
						label: "审批中",
						value: 2
					},
					{
						label: "审批拒绝",
						value: 3
					},
					{
						label: "审批通过",
						value: 3
					},
					{
						label: "作废",
						value: 5
					},
				]
			},
		]
		//定义动态表格-格式
		const columns = reactive([
			{
				label: '单号',
				prop: 'orderNo',
				width: 150,
			},
			{
				label: '申请人',
				prop: 'applyUser',
				formatter(row) {
					return row.applyUser.userName
				},
			},
			{
				label: '休假时间',
				prop: 'time',
				width: 220,
				formatter(row) {
					return (
						util.formateDate(new Date(row.startTime), 'yyyy-MM-dd') +
						' 至 ' +
						util.formateDate(new Date(row.endTime), 'yyyy-MM-dd')
					)
				},
			},
			{
				label: '休假时长',
				prop: 'leaveTime',
			},
			{
				label: '休假类型',
				prop: 'applyType',
				formatter(row, column, value) {
					return {
						1: '事假',
						2: '调休',
						3: '年假',
					}[value]
				},
			},
			{
				label: '休假原因',
				prop: 'reasons',
			},
			{
				label: '申请时间',
				prop: 'createTime',
				width: 220,
				formatter(row, column, value) {
					return util.formateDate(new Date(value))
				},
			},
			{
				label: '审批人',
				prop: 'auditUsers',
			},
			{
				label: '当前审批人',
				prop: 'curAuditUserName',
			},
			{
				label: '审批状态',
				prop: 'applyState',
				formatter: (row, column, val) => {
					return {
						1: '待审批',
						2: '审批中',
						3: '审批拒绝',
						4: '审批通过',
						5: '作废',
					}[val]
				},
			},
		])
		const detailVisible = ref(false)
		const detailForm = ref({})
		const userInfo = proxy.$store.state.userInfo
		const auditForm = reactive({
			remark: '',
		})
		//初始化分页对象
		const pager = reactive({
			pageNum: 1,
			pageSize: 10,
		})
		onMounted(() => {
			getApplyList()
		})
		const applyList = ref([])
		const getApplyList = async () => {
			let params = { ...queryForm, ...pager, type: 'approve' }
			let { list, page } = await proxy.$api.getApplyList(params)
			applyList.value = list
			pager.total = page.total
		}
		const rules = {
			remark: [
				{
					required: true,
					message: '请输入审核备注',
					trigger: 'change',
				},
			],
		}
		const handleQuery = (values) => {
			getApplyList(values)
		}
		//重置查询表单
		const handleReset = (form) => {
			proxy.$refs[form].resetFields()
		}
		//分页事件处理
		const handleCurrentChange = (current) => {
			pager.pageNum = current
		}
		const handleClose = () => {
			detailVisible.value = false
			handleReset('dialogForm')
		}
		const handleDetail = (row) => {
			detailVisible.value = true
			let data = { ...row }
			data.applyTypeName = {
				1: '事假',
				2: '调休',
				3: '年假',
			}[data.applyType]

			data.time =
				util.formateDate(new Date(data.startTime), 'yyyy-MM-dd') +
				'到' +
				util.formateDate(new Date(data.endTime), 'yyyy-MM-dd')
			data.applyStateName = {
				1: '待审批',
				2: '审批中',
				3: '审批拒绝',
				3: '审批通过',
				3: '作废',
			}[data.applyState]
			detailForm.value = data
		}
		const handleApprove = (action) => {
			proxy.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					let params = {
						action,
						remark: auditForm.remark,
						_id: detailForm.value._id,
					}
					try {
						await proxy.$api.leaveApprove(params)
						handleClose()
						proxy.$message.success('处理成功')
						getApplyList()
						proxy.$store.commit("saveNoticeCount", proxy.$store.noticeCount - 1)
					} catch (error) {
						console.log(error)
					}
				}
			})
		}
		return {
			queryForm,
			columns,
			pager,
			rules,
			detailVisible,
			userInfo,
			form,
			detailForm,
			auditForm,
			applyList,
			getApplyList,
			handleReset,
			handleCurrentChange,
			handleClose,
			handleDetail,
			handleApprove,
		}
	},
}
</script>

<style lang="scss"></style>
