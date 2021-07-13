<template>
	<v-container>
		<v-text-field label="Username" v-model="username" outlined />
		<v-text-field
			label="Password"
			type="password"
			v-model="password"
			outlined
		/>
		<v-btn color="blue" outlined :loading="isLoading" @click="handleLogin()"
			>Go!</v-btn
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
import store from "../store/index";

export default {
	name: "LoginCard",
	data: () => ({
		username: null,
		password: null,
		isLoading: false,

		snackbarText: "",
		snackbar: false,
		timeout: 2000,
	}),
	methods: {
		async handleLogin() {
			this.isLoading = true;
			if (this.username !== "" && this.password !== "") {
				await axios
					.post(`${constants.URL}:${constants.PORT}/login`, {
						data: { email: this.username, password: this.password },
					})
					.then((res) => {
						if (res.status === 200) {
							store.commit("login", res.data);
						} else {
							this.snackbarText = "Oh, you typed that wrong.";
							this.snackbar = true;
						}
					})
					.catch((e) => {
						this.snackbarText = "Oh, perhaps you typed that wrong.";
						this.snackbar = true;
					})
					.finally(() => {
						this.password = null;
					});
			}
			this.isLoading = false;
		},
	},
};
</script>

<style></style>
