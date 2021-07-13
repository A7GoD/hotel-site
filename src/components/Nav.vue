<template>
	<div id="nav">
		<v-btn class="nav-btn" :color="home" @click="goHome()">Home</v-btn>
		<v-btn class="nav-btn" :color="book" @click="goBook()">Book</v-btn>
	</div>
</template>

<script>
export default {
	name: "Nav",
	isActive: true,

	data: () => ({
		home: null,
		book: null,
	}),
	methods: {
		goHome() {
			if (this.$router.currentRoute.path !== "/") this.$router.push("/");
		},
		goBook() {
			if (this.$router.currentRoute.path !== "/book")
				this.$router.push("/book");
		},
	},
	mounted() {
		console.log(this.$router.currentRoute.path);
		if (this.$router.currentRoute.path === "/") {
			this.home = "blue";
			this.book = null;
		} else if (this.$router.currentRoute.path === "/book") {
			this.book = "blue";
			this.home = null;
		}
	},
	watch: {
		$route: function() {
			if (this.$router.currentRoute.path === "/") {
				this.home = "blue";
				this.book = null;
			} else {
				this.home = null;
				this.book = "blue";
			}
		},
	},
};
</script>

<style>
#nav {
	position: absolute;
	z-index: 100;
	top: 8px;
	left: 50px;
}
.nav-btn {
	margin-right: 10px;
}

.activebtn {
	background-color: blue !important;
}
</style>
