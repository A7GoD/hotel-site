<template>
	<v-app>
		<div class="base" :class="{ squeeze: !isLoggedIn }">
			<div
				class="margin-box"
				style="padding-right: 0px; flex-grow: 1; opacity: 98%;"
			>
				<v-card class="sizing details-card">
					<transition name="cardChange" mode="out-in">
						<component
							:is="detailsCard"
							@logout="logoutMessage()"
						/>
					</transition>
				</v-card>
			</div>
			<div class="margin-box" style="width: 35vw; opacity: 98%;">
				<v-card class="sizing booking-form">
					<book-room-form />
				</v-card>
			</div>
		</div>

		<v-snackbar v-model="snackbar" :timeout="timeout">
			{{ snackbarText }}

			<template v-slot:action="{ attrs }">
				<v-btn
					color="blue"
					text
					v-bind="attrs"
					@click="snackbar = false"
				>
					Close
				</v-btn>
			</template>
		</v-snackbar>
	</v-app>
</template>

<script>
import BookRoomForm from "@/components/BookRoomForm.vue";
import LoginRegister from "@/components/LoginRegister.vue";
import Bookings from "@/components/Bookings.vue";
import store from "../store/index";

export default {
	components: { LoginRegister, BookRoomForm, Bookings },
	data: () => ({
		doSqueeze: true,

		snackbarText: "",
		snackbar: false,
		timeout: 2000,
	}),

	methods: {
		logoutMessage: function() {
			this.snackbarText = `See you later, ${store.state.user.name}.`;
			this.snackbar = true;
		},
	},

	computed: {
		isLoggedIn() {
			if (store.state.user) {
				return true;
			} else return false;
		},

		detailsCard() {
			if (!this.isLoggedIn) {
				return "LoginRegister";
			} else {
				this.snackbarText = `Welcome, ${store.state.user.name}`;
				this.snackbar = true;
				return "Bookings";
			}
		},
	},
};
</script>

<style>
.sizing {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	padding: 20px 60px;
}

.details-card {
	display: flex;
	justify-content: center;
	align-items: center;
}

.margin-box {
	height: 100%;
	box-sizing: border-box;
	padding: 50px;
	transition: 300ms all;
}

.base {
	display: flex;
	grid-template-columns: 1fr minmax(0, max-content);
	grid-template-rows: 100%;
	align-items: center;
	width: 100%;
	height: 100%;

	background-image: url("/background.jpg");

	transition-delay: 2s !important;
	transition: 300ms all;
}

.squeeze {
	width: 130%;
}
.booking-form {
	transform-origin: right;
}

.cardChange-leave-active {
	transition-delay: 2s !important;
	transition: 300ms all;
}
.cardChange-leave-to {
	opacity: 0;
}
</style>
