<template>
	<div>
		<div class="basic-layout">
			<div :class="['nav-side', isCollapse ? 'fold' : 'unfold' ]">
				<!-- logo -->
				<div class="logo">
					<img
						src="@/assets/vue.svg"
						alt=""
					/>
					<span v-if="!isCollapse">Manager</span>
				</div>
				<!-- 导航 -->
				<el-menu
					router
					background-color="#31475e"
					text-color="#fff"
					:default-active="activeMenu"
					class="nav-menu"
					:collapse="isCollapse"
          
				>
					<tree-menu :userMenu="userMenu"/>
				</el-menu>
			</div>
			<div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
				<div class="nav-top">
					<div class="nav-left">
						<el-icon class="menu-fold" @click="handleFlod">
							<Fold v-if="!isCollapse" />
							<Expand v-else />
						</el-icon>
						<div class="bread">
              <BreadCrumb/>
            </div>
					</div>
					<div class="user-info">
						<el-badge
							:is-dot="noticeCount > 0 ? true : false"
							class="notice"
              type="danger"
						>
							<el-icon> <Bell /></el-icon>
            </el-badge>
            <el-dropdown @command="handleLogout">
              <span class="user-link">
                {{ userInfo.userName }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
					</div>
				</div>
				<div class="wrapper">
					<div class="main-page">
						<router-view></router-view>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'

export default {
  name: 'Home',
  components: { TreeMenu, BreadCrumb },
	data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.split(1),
		}
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    handleFlod() {
      this.isCollapse = !this.isCollapse;
    },
    handleLogout(key) {
      this.$store.commit('saveUserInfo', '');
      this.userInfo = null;
      this.$router.push('/login');
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount();
        this.noticeCount = count;
      } catch (error) {
        console.log(error);
      }
    },
    async getMenuList() {
      try {
        const list = await this.$api.menuList();
        this.userMenu = list;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style lang="scss">
.basic-layout {
	position: relative;
	.nav-side {
		position: fixed;
		width: 200px;
		height: 100vh;
		background-color: #31475e;
		color: #31475e;
		overflow-y: auto;
		transition: width .5s;
		.logo {
			display: flex;
			align-items: center;
			font-size: 25px;
			font-weight: bold;
			height: 80px;
			background-color: #fff;
			img {
				margin: 0 16px;
			}
		}
		.nav-menu {
			height: calc(100vh - 80px);
			border-right: none;
		}
    &.fold{
      width: 64px;
    }
    &.unfold{
      width: 200px;
    }
	}
  .nav-side::-webkit-scrollbar{
    display: none;
  }
	.content-right {
		margin-left: 200px;
		.nav-top {
			height: 80px;
			line-height: 80px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #ddd;
			padding: 0 20px;
			.nav-left {
				display: flex;
				align-items: center;
				.menu-fold {
					padding-right: 16px;
					font-size: 24px;
				}
			}
      .user-info{
        display: flex;
        align-items: center;
        justify-content: center;
        .notice{
          font-size: 22px;
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link{
          cursor: pointer;
          display: flex;
          align-items: center;
          font-size: 16px;
          padding-bottom: 5px;
        }
        .user-link:focus{
          outline: none;
        }
      }
		}
    &.fold{
      margin-left: 64px;
    }
    &.unfold{
      margin-left: 200px;
    }
		.wrapper {
			background: #eef0f3;
			padding: 20px;
			height: calc(100vh - 80px);
			.main-page {
				background-color: #fff;
				height: 100%;
			}
		}
	}
}
</style>
