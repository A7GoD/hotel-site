const mysql = require("mysql");
const { QUERY_TYPES } = require("./shared/constants");

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123456",
	database: "hotel",
});

const query = async ({ table, where, values, type, select = "*" }) => {
	let query;
	return new Promise((res, rej) => {
		switch (type) {
			case QUERY_TYPES.SELECT:
				query = `select ${select} from ${table} ${
					where ? `where ${where}` : ""
				}`;
				break;
			case QUERY_TYPES.SET:
				query = `insert into ${table} values (${values})`;
				break;
			case QUERY_TYPES.DELETE:
				query = `delete from ${table} where ${where}`;
				break;
			default:
				break;
		}
		console.log(query);
		connection.query(query, (err, result) => {
			if (err) rej(err);
			res(result);
		});
	});
};

module.exports = { query };
