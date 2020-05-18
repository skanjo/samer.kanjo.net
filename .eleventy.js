module.exports = function(eleventy) {

	eleventy.setLibrary("njk", require("./lib/libraries/nunjucks.js"));

	eleventy.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"));

	eleventy.addCollection("sortedTerminalCommands", require("./lib/collections/sorted-terminal-commands.js"));

	eleventy.addPassthroughCopy("src/css");
	eleventy.addPassthroughCopy("src/img");
	eleventy.addPassthroughCopy("src/js");
	eleventy.addPassthroughCopy("src/vendor");

	eleventy.setDataDeepMerge(true);

return {
	dir: {
	      input: "src",
	      output: "dist",
	      includes: "includes",
	      layouts: "layouts",
	      data: "data"
	    },		
		dataTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		templateFormats: ['njk', 'md']
	}
}
