const mongoose = require("mongoose");


const MONGO_URL = process.env.MONGO_URL;

async function mongoConnect() {
	await mongoose.connect(MONGO_URL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	);
}

mongoose.connection.once("open", () => {
	console.log("Database connected");
});

mongoose.connection.on("error", (err) => {
	console.error(err)
});

module.exports = {
	mongoConnect
};