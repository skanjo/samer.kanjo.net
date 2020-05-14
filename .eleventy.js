const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(config) {

	config.addPlugin(syntaxHighlight);

	config.addCollection("sortedTerminalCommands", function(collection) {
		return collection.getFilteredByTag("terminal-command").sort(function(a, b){
			return a.data.title.localeCompare(b.data.title);
		});
	});

	config.addPassthroughCopy("src/css");
	config.addPassthroughCopy("src/img");
	config.addPassthroughCopy("src/js");
	config.addPassthroughCopy("src/vendor");

return {
	dir: {
	      input: "src",
	      includes: "includes",
	      layouts: "layouts",
	      data: "data",
	      output: "dist"
	    },		
		dataTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		templateFormats: ['njk', 'md', '11ty.js']
	}
}
