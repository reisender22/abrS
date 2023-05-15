const https = require("https");

module.exports = Object.freeze({
	send({ site, level = "INFO", text }) {
		if (process.env.NODE_ENV === "development") {
			return;
		}

		if (
			!["INFO", "WARN", "ERROR", "DEBUG", "SALE", "MESSAGE"].includes(level)
		) {
			throw new Error("Invalid message level");
		}

		const string = JSON.stringify({ content: text });

		const options = {
			hostname: "discord.com",
			port: 443,
			path: "/api/webhooks/910870852512395284/v1DHhK8QubOKs7gcZesAfM9dNe_Kg_XJHDsbWnyMtk4SRyWy0i0Uj1eFqjYU5qTuqzHL",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": string.length,
			},
		};

		const req = https.request(options);

		req.on("error", (error) => {
			throw error;
		});

		req.write(string);
		req.end();
	},
});
