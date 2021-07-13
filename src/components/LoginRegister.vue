<template>
	<v-container style="width: 500px">
		<div class="btn-container">
			<span
				class="text"
				@click="isDisabled = !isDisabled"
				:class="{ disabled: isDisabled }"
			>
				LOGIN
			</span>
			<v-btn class="btn-slider">{{ btnText }}</v-btn>
			<span
				class="text"
				@click="isDisabled = !isDisabled"
				:class="{ disabled: !isDisabled }"
			>
				REGISTER
			</span>
		</div>
		<transition name="swap" mode="out-in">
			<component :is="component" />
		</transition>
	</v-container>
</template>

<script>
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

export default {
	components: { LoginCard, RegisterCard },
	name: "LoginRegister",
	data: () => ({
		isDisabled: true,
	}),
	computed: {
		btnText() {
			if (this.isDisabled) return "Login";
			else return "Register";
		},
		component() {
			if (this.isDisabled) return "LoginCard";
			else return "RegisterCard";
		},
	},
};
</script>

<style lang="scss" scoped>
.disabled {
	display: none;
}

.btn-container {
	display: flex;
	grid-template-columns: auto auto;
	overflow: hidden;
	justify-content: center;
	align-items: center;
	column-gap: 10px;

	.btn-slider {
		font-size: 16px;
		pointer-events: none;
	}
	.text {
		cursor: pointer;
	}
}

.swap-enter-active,
.swap-leave-active {
	transition: all 300ms;
}
.swap-enter {
	transform: translateY(40%);
	opacity: 0;
}

.swap-leave-to {
	// transform: translateY(40%);
	opacity: 0;
}
</style>
