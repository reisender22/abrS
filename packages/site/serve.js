const sirv = require("sirv");
const polka = require("polka");

const port = process.env.PORT || 3000;
const assets = sirv("dist", { single: true });

polka()
	.use(assets)
	.listen(port, err => {
		if (err) throw err;
		console.log(`> Ready on localhost:${port}~!`);
	});
