const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(config) {

	config.addPlugin(syntaxHighlight);

	config.addCollection("sortedTerminalCommands", function(collection) {
		return collection.getFilteredByTag("terminal-command").sort(function(a, b){
			return a.data.title.localeCompare(b.data.title);
		});
	});

return {
	dir: {
	      input: "src",
	      output: "dist"
	    }
	}
}