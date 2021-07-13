import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { constants } from "../constants";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		bookings: null,
		transactions: null,
	},
	mutations: {
		login(context, payload) {
			context.user = payload;
			localStorage.setItem("user", JSON.stringify(payload));
		},

		logout(context) {
			context.user = null;
			localStorage.removeItem("user");
		},

		setBookings(context, payload) {
			context.bookings = payload;
		},

		setTransactions(context, payload) {
			context.transactions = payload;
		},
	},
	actions: {
		async getBookedRooms(context) {
			await axios
				.get(
					`${constants.URL}:${constants.PORT}/room/get-booked-rooms`,
					{ params: { email: context.state.user.email } }
				)
				.then((res) => {
					const data = res.data.data;
					context.commit("setBookings", data);
				})
				.catch((e) => console.log(e));
		},
		async getTransactions(context) {
			await axios
				.get(`${constants.URL}:${constants.PORT}/transactions`, {
					params: { email: context.state.user.email },
				})
				.then((res) => {
					const data = res.data;
					data.sort((a, b) => b.sno - a.sno);
					context.commit("setTransactions", data);
				})
				.catch((e) => console.log(e));
		},
	},
});
