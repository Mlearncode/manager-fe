<template>
  <template v-for="menu in userMenu">
    <el-sub-menu v-if="menu.children && menu.children.length>0 && menu.children[0].menuType == 1" :index="menu.path" :key="menu._id">
		<template #title>
			<component class="el-icon" :is="menu.icon"></component>
			<span>{{ menu.menuName }}</span>
		</template>
		<tree-menu :userMenu="menu.children" />
    </el-sub-menu>
    <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path">
			<template #title>
				<component class="el-icon" :is="menu.icon"></component>
				<span>{{ menu.menuName }}</span>
		</template></el-menu-item>
  </template>
</template>

<script>
export default {
	name: 'TreeMenu',
	props: {
		userMenu: {
			type: Array,
			default() {
				return []
			},
		},
	},
}
</script>

<style lang="scss"></style>
