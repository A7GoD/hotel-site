<template>
	<v-container class="d-flex flex-column" style="height: 100%;">
		<div class="btn-container d-flex justify-end">
			<v-btn
				v-if="tableType === 'Bookings'"
				@click="tableSwitch()"
				style="margin-right: 10px;"
				outlined
				><v-icon style="margin-right: 10px;">mdi-currency-btc</v-icon
				>Transactions</v-btn
			>
			<v-btn
				v-if="tableType === 'Transactions'"
				@click="tableSwitch()"
				style="margin-right: 10px;"
				outlined
				><v-icon style="margin-right: 10px;"
					>mdi-cellphone-arrow-down</v-icon
				>Bookings</v-btn
			>
			<v-btn @click="handleLogout()" outlined
				><v-icon style="margin-right: 10px;">mdi-exit-to-app</v-icon
				>Logout</v-btn
			>
		</div>
		<v-data-table
			v-if="tableType === 'Bookings'"
			:headers="headers"
			:items="items"
			:search="search"
			:items-per-page="5"
		>
			<template slot="top">
				<div style="text-align: left;">Current Bookings</div>
			</template>

			<template slot="item.booked_on" slot-scope="data" elevation="15">
				{{ new Date(data.item.booked_on).toDateString() }}
			</template>

			<template slot="item.actions" slot-scope="data" elevation="15">
				<v-btn
					small
					outlined
					color="primary"
					@click.stop="showDetailsOf(data.item)"
					style="margin-right: 10px;"
					>More Details</v-btn
				>
				<v-btn
					small
					outlined
					color="primary"
					@click.stop="cancelBooking(data.item)"
					><v-icon>mdi-cancel</v-icon></v-btn
				>
			</template>
		</v-data-table>

		<v-data-table
			v-if="tableType === 'Transactions'"
			:headers="transactionHeaders"
			:items="transactions"
			:items-per-page="5"
		>
			<template slot="top">
				<div style="text-align: left;">All transactions</div>
			</template>
			<template slot="item.trans_date" slot-scope="data" elevation="15">
				{{ new Date(data.item.trans_date).toDateString() }}
			</template>
		</v-data-table>

		<v-dialog
			v-model="dialog"
			width="45%"
			transition="dialog-bottom-transition"
		>
			<v-card class>
				<v-card-title
					class="headline blue"
					style="margin-bottom: 12px;"
				>
					Booking Details
				</v-card-title>
				<v-card-text class="padding-adj d-flex align-center">
					<div class="details-container">
						<v-card
							class="cost-container-card padding-adj"
							color="blue"
							outlined
						>
							<v-icon class="icon" x-large
								>mdi-cash-multiple</v-icon
							>
							<div class="d-flex flex-column">
								<div class="room-no">
									Room No.
									{{ dialogRoom ? dialogRoom.room_id : null }}
								</div>
								<div class="price">
									₹
									{{
										dialogRoom
											? dialogRoom.price *
											  dialogRoom.dates.length
											: null
									}}
								</div>
							</div>
						</v-card>
						<v-card outlined>
							<v-card-title class="date-card">
								<v-icon class="icon" x-large
									>mdi-cellphone-arrow-down</v-icon
								>
								<div class="d-flex flex-column">
									<div class="date-title">
										Booked on:
									</div>
									<div class="date">
										{{
											dialogRoom
												? new Date(
														dialogRoom.booked_on
												  ).toLocaleDateString()
												: null
										}}
									</div>
								</div>
							</v-card-title>
						</v-card>
					</div>
					<div class="calender-container">
						<v-chip class="ma-2" label>
							<v-icon style="padding-right:5px" dense>
								mdi-calendar-range
							</v-icon>
							<h3>Booked Dates</h3></v-chip
						>
						<v-date-picker
							v-model="dialogDates"
							width="100%"
							readonly
							multiple
							no-title
						></v-date-picker>
					</div>
				</v-card-text>
			</v-card>
		</v-dialog>

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
import { constants } from "@/constants";

// import store from "../store/index";

export default {
	name: "Bookings",
	data: () => ({
		headers: [
			{
				text: "Room",
				value: "room_id",
			},

			{
				text: "Booked On",
				value: "booked_on",
			},
			{ text: "Days Booked", value: "dates.length" },
			{
				text: "Actions",
				value: "actions",
				sortable: false,
			},
		],

		items: [],
		search: "",

		transactionHeaders: [
			{ text: "Date", value: "trans_date" },
			{ text: "Type", value: "trans_type" },
			{ text: "Amount", value: "price" },
		],

		transactions: [],

		tableType: "Bookings",

		dialog: false,
		dialogDates: [],
		dialogRoom: null,

		snackbarText: "",
		snackbar: false,
		timeout: 2000,
	}),
	methods: {
		showDetailsOf(room) {
			this.dialogRoom = room;
			this.dialog = true;
			this.dialogDates = room.dates.map((date) => {
				const dateObj = new Date(date);
				return `${dateObj.getFullYear()}-${
					dateObj.getMonth() + 1 > 9
						? dateObj.getMonth() + 1
						: `0${dateObj.getMonth() + 1}`
				}-${dateObj.getDate()}`;
			});
		},

		async cancelBooking(room) {
			await axios
				.delete(`${constants.URL}:${constants.PORT}/room/book`, {
					data: { booking_id: room.booking_id },
				})
				.then((res) => {
					this.snackbar = true;
					this.snackbarText = `Booking for Room No. ${room.room_id} has been cancelled.`;
				})
				.catch((err) => {
					this.snackbar = true;
					this.snackbarText = err;
				});
			this.$store.dispatch("getBookedRooms");
			this.$store.dispatch("getTransactions");
		},

		handleLogout() {
			this.$emit("logout");
			this.$store.commit("logout");
		},

		tableSwitch() {
			if (this.tableType === "Bookings") this.tableType = "Transactions";
			else this.tableType = "Bookings";
		},
	},

	computed: {
		bookings() {
			return this.$store.state.bookings;
		},
		getTransactions() {
			return this.$store.state.transactions;
		},
	},

	watch: {
		"$store.state.bookings"() {
			this.items = this.bookings;
		},
		"$store.state.transactions"() {
			this.transactions = this.getTransactions;
		},
	},

	mounted() {
		this.$store.dispatch("getBookedRooms");
		this.$store.dispatch("getTransactions");
	},
};
</script>

<style>
.padding-adj {
	padding: 12px;
}

.calender-container {
	margin-left: auto;
	width: 50%;
}

.details-container {
	margin-left: auto;
}

.cost-container-card {
	padding: 24px;
	padding-top: 20px;
	display: flex;
	margin-bottom: 10px;
	flex-direction: row;
	align-items: center;
}
.price {
	height: max-content;
	margin-right: auto;
	text-align: left;
	font-size: xx-large;
}
.room-no {
	height: max-content;
	margin-right: auto;
	text-align: left;
	font-weight: 300;
}

.date-title {
	font-size: small;
	align-self: flex-start;
	height: 25px;
}

.date {
	font-size: xx-large;
}

.icon {
	margin-right: 12px;
}
</style>
