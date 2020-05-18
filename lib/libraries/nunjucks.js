const NunjucksLib = require("nunjucks");

module.exports = (() => {
	const env = new NunjucksLib.Environment([
			new NunjucksLib.FileSystemLoader("./src/includes"), 
			new NunjucksLib.FileSystemLoader("./src/layouts")
		], {
			autoescape: true,
			throwOnUndefined: false,
			trimBlocks: false,
			lstripBlocks: false,
			watch: false,
			noCache: false
		}
	);

	return env;
})();
