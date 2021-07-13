<template>
	<div>
		Make a new booking:
		<v-select
			:items="rooms"
			item-text="beds"
			label="Select Beds"
			v-model="beds"
			solo
		></v-select>

		<v-select
			:disabled="beds === null"
			:items="rooms.filter((room) => room.beds === beds)"
			item-text="price"
			label="Select Price (per day)"
			v-model="price"
			@change="getReservedDates"
			solo
		>
			<template slot="item" slot-scope="data">
				₹{{ data.item.price }}
			</template>
		</v-select>

		<v-date-picker
			header-color="primary"
			width="100%"
			:disabled="price === null"
			v-model="datesBooked"
			:allowed-dates="getAllowedDates"
			multiple
		></v-date-picker>

		<v-btn
			class="margin"
			@click="bookRoom"
			:loading="isButtonLoading"
			width="100%"
			outlined
			color="blue"
			>Book Now
			{{
				datesBooked.length > 0 ? `, Price: ₹${calcPrice}` : null
			}}</v-btn
		>
		<v-snackbar v-model="error" :timeout="2000">
			{{ errorMessage }}
		</v-snackbar>
	</div>
</template>

<script>
import axios from "axios";
import { constants } from "../constants.js";
import store from "../store/index";

export default {
	name: "BookRoomForm",
	data: () => ({
		rooms: [],
		room: null,
		beds: null,
		price: null,
		datesBooked: [],
		datesReserved: [],
		error: false,
		errorMessage: "",

		isButtonLoading: false,
		isResetting: false,
	}),
	methods: {
		getAllowedDates(date) {
			const isReserved = this.datesReserved.find((d) => {
				return (
					new Date(date).toLocaleDateString() ===
					new Date(d).toLocaleDateString()
				);
			});

			if (isReserved) return false;
			else {
				if (new Date() > new Date(date)) {
					return false;
				} else return true;
			}
		},
		getReservedDates() {
			this.room = this.rooms.find((room) =>
				room.beds === this.beds && room.price === this.price
					? true
					: false
			);
			axios
				.get(
					`${constants.URL}:${constants.PORT}/room/get-booked-dates`,
					{
						params: {
							room_id: this.room.id,
						},
					}
				)
				.then((res) => {
					const { data } = res.data;
					this.datesReserved = data;
				});
		},
		bookRoom() {
			this.isButtonLoading = true;
			if (this.datesBooked.length === 0) {
				this.isButtonLoading = false;
				return;
			}
			axios
				.post(`${constants.URL}:${constants.PORT}/room/book`, {
					data: {
						email: store.state.user.email,
						room_id: this.room.id,
						dates: this.datesBooked,
					},
				})
				.then(() => {
					this.isButtonLoading = false;
					this.isResetting = true;
					this.beds = null;
					this.price = null;
					this.datesBooked = [];
					this.datesReserved = [];
					this.isResetting = false;

					this.$store.dispatch("getBookedRooms");
					this.$store.dispatch("getTransactions");
					this.error = true;
					this.errorMessage = "Booking successful";
				});
		},
	},
	mounted() {
		axios.get(`${constants.URL}:${constants.PORT}/rooms`).then((res) => {
			const { data, err } = res.data;
			if (data) {
				this.rooms = data.sort((a, b) => {
					return a.beds - b.beds;
				});
			} else {
				this.error = true;
				this.errorMessage = err.message;
			}
		});
	},

	computed: {
		calcPrice() {
			return this.price * this.datesBooked.length;
		},
	},
};
</script>

<style type="scss">
.margin {
	margin-top: 20px;
}
</style>
