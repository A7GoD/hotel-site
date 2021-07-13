<template>
	<div id="app">
		<v-app>
			<Nav />
			<transition name="fade" mode="out-in">
				<router-view />
			</transition>
		</v-app>
	</div>
</template>

<script>
import Nav from "@/components/Nav";

export default {
	components: { Nav },
	beforeCreate() {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			this.$store.commit("login", user);
		}
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	font-family: "Open Sans", sans-serif;
}
*::-webkit-scrollbar {
	display: none;
}

.fade-enter-active {
	transition: all 300ms;
}
.fade-enter {
	opacity: 0;
}
</style>
