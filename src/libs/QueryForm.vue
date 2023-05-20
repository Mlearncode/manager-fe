<template>
	<el-form
		ref="queryForm"
		:inline="true"
		:model="queryModel"
	>
  <template v-for="(item,index) in form" :key="index">
    <FormItem :item="item" v-model="queryModel[item.model]" v-bind="item"/>
  </template>
		<el-form-item>
			<el-button
				type="primary"
				@click="handleQuery"
				>查询</el-button
			>
			<el-button
				type="danger"
				@click="handleReset()"
				>重置</el-button
			>
		</el-form-item>
	</el-form>
</template>

<script>
import { getCurrentInstance, reactive } from 'vue'
import FormItem from '../components/FormItem.vue'
export default {
  name: 'QueryForm',
  props: ["modelValue", "form"],
  emit:["update:modelValue"],
  components:{ FormItem },
  setup(props, context) {
    const proxy = getCurrentInstance()
    const form = props.form
    
    const queryModel = reactive({...props.modelValue})
    const handleReset = () => {
      proxy.refs.queryForm.resetFields()
    }
    const handleQuery = ()=>{
      context.emit("update:modelValue", { ...queryModel })
      context.emit("handleQuery", { ...queryModel })
    }
    return {
      form,
      queryModel,
      handleReset,
      handleQuery
    }
  },
}
</script>

<style lang="scss"></style>
