const express = require("express");
const cors = require("cors");
const { query } = require("./mysql");
const { QUERY_TYPES } = require("./shared/constants");
const { v4: uuid } = require("uuid");
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());

// CRUD
// CREATE, RETREIVE, UPDATE, DELETE
// USER, ROOM, BOOKING

// req =>
// res => room with req beds
app.get("/rooms", async (req, res) => {
	query({
		type: QUERY_TYPES.SELECT,
		table: "rooms",
	})
		.then((result) => {
			res.send({
				data: result,
				err: null,
			});
		})
		.catch((e) => {
			res.send({
				data: null,
				err: { message: e.sqlMessage },
			});
		});
});

// req => room_id
// res => [dates]
app.get("/room/get-booked-dates", async (req, res) => {
	const { room_id } = req.query;

	query({
		type: QUERY_TYPES.SELECT,
		select: "booked_for",
		table: "rooms, booked_rooms",
		where: `rooms.id = booked_rooms.id and booked_rooms.id = ${room_id}`,
	})
		.then((result) => {
			const dates = [];
			result.map((e) => {
				dates.push(e.booked_for);
			});
			res.send({
				data: dates,
				err: null,
			});
		})
		.catch((e) => {
			res.send({
				data: null,
				err: { message: e.sqlMessage },
			});
		});
});

//req => email,
//res => [all booked rooms]
app.get("/room/get-booked-rooms", async (req, res) => {
	const { email } = req.query;
	await query({
		type: QUERY_TYPES.SELECT,
		select: "distinct booking_id",
		table: "booked_rooms",
		where: `booked_by = "${email}"`,
	})
		.then(async (result) => {
			const resultCleaned = [];
			result.forEach((element) => {
				resultCleaned.push(element.booking_id);
			});

			const processedData = await Promise.all(
				resultCleaned.map(async (element) => {
					const roomDateData = await query({
						type: QUERY_TYPES.SELECT,
						select: "booked_for",
						table: "booked_rooms",
						where: `booking_id = "${element}"`,
					});

					const otherData = await query({
						type: QUERY_TYPES.SELECT,
						select: "distinct id, booked_on, price",
						table: "rooms natural join booked_rooms",
						where: `booking_id = "${element}"`,
					});

					const roomDateDataProcessed = await roomDateData.map(
						(date) => date.booked_for
					);

					return {
						booking_id: element,
						dates: [...roomDateDataProcessed],
						room_id: otherData[0].id,
						booked_on: otherData[0].booked_on,
						price: otherData[0].price,
					};
				})
			);

			res.send({
				data: processedData,
				err: null,
			});
		})
		.catch((e) => {
			res.send({
				data: null,
				err: { message: e.sqlMessage },
			});
		});
});

//req: room_id, email, dates
//res: {data: null || data, err: null || {message}}
app.post("/room/book", async (req, res) => {
	const { room_id, email, dates } = req.body.data;
	const booking_id = uuid();

	let breakLoop = false;
	for (date of dates) {
		await query({
			type: QUERY_TYPES.SET,
			table: "booked_rooms",
			values: `${room_id}, "${email}", "${date}", curdate(), "${booking_id}"`,
		}).catch((e) => {
			res.status(400);
			res.send({
				data: null,
				err: { message: e.sqlMessage },
			});
			breakLoop = true;
		});
		if (breakLoop) break;
	}
	if (!breakLoop) {
		const room_price = await query({
			type: QUERY_TYPES.SELECT,
			select: "price",
			table: "rooms",
			where: `id = "${room_id}"`,
		});

		const price = dates.length * room_price[0].price;

		await query({
			type: QUERY_TYPES.SET,
			table:
				"transactions(booking_id, trans_date, trans_type, price, email)",
			values: `"${booking_id}", curdate(), "ROOM BOOK", ${price}, "${email}"`,
		});

		res.status(200);
		res.send({ data: "OK", err: null });
	}
});

// req: booking_id
// res: status: 200, body: "ok" | status: 400
app.delete("/room/book", async (req, res) => {
	const { booking_id } = req.body;
	await query({
		table: "booked_rooms",
		type: QUERY_TYPES.DELETE,
		where: `booking_id = "${booking_id}"`,
	})
		.then(async () => {
			const email_price = await query({
				type: QUERY_TYPES.SELECT,
				select: "email, price",
				table: "transactions",
				where: `booking_id = "${booking_id}"`,
			});

			await query({
				type: QUERY_TYPES.SET,
				table:
					"transactions(booking_id, trans_date, trans_type, price, email)",
				values: `"${booking_id}", curdate(), "BOOKING CANCEL / REFUND", ${email_price[0].price}, "${email_price[0].email}"`,
			});

			res.status(200);
			res.send("ok");
		})
		.catch((e) => {
			res.status(400);
			res.send(e.sqlMessage);
		});
});

// req: email
// res: [transactions]
app.get("/transactions", async (req, res) => {
	const { email } = req.query;
	try {
		const result = await query({
			type: QUERY_TYPES.SELECT,
			table: "transactions",
			where: `email = "${email}"`,
		});
		res.send(result);
	} catch (e) {
		res.statusCode(400).send(e.sqlMessage);
	}
});

// req: email, password
// res: name, email, booked_rooms
app.post("/login", async (req, res) => {
	const { email, password } = req.body.data;

	const result = await query({
		table: "users",
		type: QUERY_TYPES.SELECT,
		where: `email = "${email}" and password = "${password}"`,
	});

	if (result.length > 0) {
		const user = {
			name: result[0].name,
			email: result[0].email,
			booked_rooms: result[0].booked_rooms,
		};
		res.status(200);
		res.send(user);
	} else {
		res.status(400);
		res.send(null);
	}
});

// req: name, email, password
// res: status: 201 | status: 400
app.post("/register", async (req, res) => {
	const { name, email, password } = req.body.data;
	await query({
		table: "users(name, email, password)",
		type: QUERY_TYPES.SET,
		values: `"${name}","${email}", "${password}"`,
	})
		.then(() => {
			res.status(201);
			res.send("ok");
		})
		.catch((e) => {
			res.status(400);
			res.send(e.sqlMessage);
		});
});

app.listen(port, () => {
	setInterval(() => {
		query({
			type: QUERY_TYPES.DELETE,
			table: "booked_rooms",
			where: "booked_for < curdate()",
		});
		console.log("Cleaned Expired records");
	}, 60 * 1000);
	console.log(`Server running on port ${port}`);
});
