<template>
	<div class="leave-manager">
		<div class="query-form">
			<el-form
				ref="form"
				:inline="true"
				:model="queryForm"
			>
				<el-form-item
					label="审批状态"
					prop="applyState"
				>
					<el-select v-model="queryForm.applyState">
						<el-option
							value=""
							label="全部"
						></el-option>
						<el-option
							:value="1"
							label="待审批"
						></el-option>
						<el-option
							:value="2"
							label="审批中"
						></el-option>
						<el-option
							:value="3"
							label="审批拒绝"
						></el-option>
						<el-option
							:value="4"
							label="审批通过"
						></el-option>
						<el-option
							:value="5"
							label="作废"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="getApplyList"
						>查询</el-button
					>
					<el-button
						type="danger"
						@click="handleReset('userForm')"
						>重置</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<div class="base-table">
			<div class="action">
				<el-button
					type="primary"
					@click="handleApply"
					>申请休假</el-button
				>
			</div>
			<el-table
				:data="applyList"
				@selection-change="handleSelectChange"
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
							>查看</el-button
						>
						<el-button
							type="danger"
							size="small"
							@click="handleDelete(scope.row._id)"
							v-if="[1, 2].includes(scope.row.applyState)"
							>作废</el-button
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
			title="申请休假"
			v-model="dialogVisible"
			width="70%"
		>
			<el-form
				ref="dialogForm"
				:model="leaveForm"
				label-width="100px"
				:rules="rules"
			>
				<el-form-item
					label="休假类型"
					prop="applyType"
					required
				>
					<el-select v-model="leaveForm.applyType">
						<el-option
							label="事假"
							:value="1"
						></el-option>
						<el-option
							label="调休"
							:value="2"
						></el-option>
						<el-option
							label="年假"
							:value="3"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="休假时间"
					required
				>
					<el-row :gutter="24">
						<el-col :span="8">
							<el-form-item prop="startTime">
								<el-date-picker
									v-model="leaveForm.startTime"
									type="date"
									placeholder="选择开始日期"
									@change="(val) => handleDateChange('startTime', val)"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="1">-</el-col>
						<el-col :span="8">
							<el-form-item prop="endTime">
								<el-date-picker
									v-model="leaveForm.endTime"
									type="date"
									placeholder="选择结束日期"
									@change="(val) => handleDateChange('endTime', val)"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item
					label="休假时长"
					prop="leaveTime"
					required
				>
					{{ leaveForm.leaveTime }}
				</el-form-item>
				<el-form-item
					label="休假原因"
					prop="reasons"
					required
				>
					<el-input
						type="textarea"
						:row="3"
						placeholder="请输入休假原因"
						v-model="leaveForm.reasons"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span>
					<el-button
						type="danger "
						@click="handleClose"
						>取消</el-button
					>
					<el-button
						type="primary"
						@click="leaveSubmit"
						>确定</el-button
					>
				</span>
			</template>
		</el-dialog>
		<el-dialog
			title="申请休假详情"
			width="50%"
			v-model="detailVisible"
			destroy-on-close
		>
			<el-steps
				:active="detailForm.applyState > 2 ? 3 : detailForm.applyState"
				align-center
				finish-status="success"
			>
				<el-step title="待审批"></el-step>
				<el-step title="审批中"></el-step>
				<el-step title="审批通过/审批拒绝"></el-step>
			</el-steps>
			<el-form
				label-width="100px"
				label-suffix=":"
			>
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
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { getCurrentInstance, onMounted, ref, reactive, toRaw } from 'vue'
import util from '@/utils/toolUtils'
export default {
	name: 'Leave',
	setup() {
		const { proxy } = getCurrentInstance()
		const queryForm = reactive({
			applyState: '',
		})
		//定义动态表格-格式
		const columns = reactive([
			{
				label: '单号',
				prop: 'orderNo',
				width: 150,
			},
			{
				label: '休假时间',
				prop: 'time',
				width: 220,
				formatter(row) {
					return (
						util.formateDate(new Date(row.startTime), 'yyyy-MM-dd') +
						'到' +
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
				prop: 'auditUser',
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
		const rules = reactive({
			startTime: [
				{
					type: 'date',
					required: true,
					message: '请输入开始日期',
					trigger: 'change',
				},
			],
			endTime: [
				{
					type: 'date',
					required: true,
					message: '请输入结束日期',
					trigger: 'change',
				},
			],
			reasons: [
				{
					required: true,
					message: '请输入休假原因',
					trigger: ['change', 'blur'],
				},
			],
		})
		const dialogVisible = ref(false)
		const detailVisible = ref(false)
		const leaveForm = reactive({
			applyType: 1,
			startTime: '',
			endTime: '',
			leaveTime: '0天',
			reasons: '',
		})
		const detailForm = ref({})
		const action = ref('create')
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
			let params = { ...queryForm, ...pager }
			let { list, page } = await proxy.$api.getApplyList(params)
			applyList.value = list
			pager.total = page.total
		}

		//重置查询表单
		const handleReset = (form) => {
			proxy.$refs[form].resetFields()
		}
		//分页事件处理
		const handleCurrentChange = (current) => {
			pager.pageNum = current
		}
		const handleApply = () => {
			dialogVisible.value = true
			action.value = 'create'
		}
		const handleClose = () => {
			dialogVisible.value = false
			handleReset('dialogForm')
		}
		const handleDateChange = (key, val) => {
			let { startTime, endTime } = leaveForm
			if (!startTime || !endTime) return
			if (startTime > endTime) {
				proxy.$message.error('开始日期不能晚于结束日期')
				leaveForm.leaveTime = '0天'
				setTimeout(() => {
					leaveForm[key] = ''
				}, 0)
			} else {
				leaveForm.leaveTime =
					(endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + '天'
			}
		}
		const leaveSubmit = () => {
			proxy.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					try {
						let params = { ...leaveForm, action: action.value }
						let res = await proxy.$api.leaveSubmit(params)
						params.action == 'create'
							? proxy.$message.success('申请成功')
							: proxy.$message.success('编辑成功')
						handleClose()
						getApplyList()
					} catch (error) {}
				}
			})
		}
		const handleDetail = (row) => {
			detailVisible.value = true
			let data = { ...row }
			data.applyTypeName = {
				1: "事假",
				2: "调休",
				3: "年假"
			}[data.applyType]

			data.time = (
				util.formateDate(new Date(data.startTime), "yyyy-MM-dd") + "到" + util.formateDate(new Date(data.endTime), "yyyy-MM-dd")
			)
			data.applyStateName = {
				1: "待审批",
				2: "审批中",
				3: "审批拒绝",
				3: "审批通过",
				3: "作废",
			}[data.applyState]
			detailForm.value = data
		}
		const handleDelete = async (row) => {
			try {
						let params = { _id, action: "delete" }
						let res = await proxy.$api.leaveSubmit(params)
						proxy.$message.success('删除成功')
						getApplyList()
					} catch (error) {}
		}
		return {
			queryForm,
			columns,
			pager,
			rules,
			dialogVisible,
			detailVisible,
			action,
			leaveForm,
			detailForm,
			applyList,
			getApplyList,
			handleReset,
			handleCurrentChange,
			handleApply,
			handleClose,
			leaveSubmit,
			handleDateChange,
			handleDetail,
			handleDelete
		}
	},
}
</script>

<style lang="scss"></style>
