<template>
	<v-container>
		<v-text-field label="Name" v-model="name" outlined />
		<v-text-field label="Email" v-model="email" outlined />
		<v-text-field
			label="Password"
			type="password"
			v-model="password1"
			outlined
		/>
		<v-text-field
			label="Retype Password"
			type="password"
			v-model="password2"
			outlined
		/>
		<v-btn
			color="blue"
			outlined
			:loading="isLoading"
			@click="handleRegistration()"
			>Register</v-btn
		>

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
	</v-container>
</template>

<script>
import axios from "axios";
import { constants } from "../constants";

export default {
	name: "RegisterCard",
	data: () => ({
		name: null,
		email: null,
		password1: null,
		password2: null,
		isLoading: false,

		snackbarText: "",
		snackbar: false,
		timeout: 2000,
	}),
	methods: {
		async handleRegistration() {
			this.isLoading = true;
			if (this.password1 === this.password2) {
				await axios
					.post(`${constants.URL}:${constants.PORT}/register`, {
						data: {
							name: this.name,
							email: this.email,
							password: this.password1,
						},
					})
					.then((res) => {
						this.snackbarText =
							"You're successfully registered with us :)";
						this.snackbar = true;

						this.$store.commit("login", {
							name: this.name,
							email: this.email,
						});
					})
					.catch(() => {
						this.snackbarText = "There seeems to be some error :(";
						this.snackbar = true;

						this.password1 = this.password2 = null;
					});
			} else {
				this.snackbarText = "Passwords do no match, please try again.";
				this.snackbar = true;
			}

			this.isLoading = false;
		},
	},
};
</script>

<style></style>
