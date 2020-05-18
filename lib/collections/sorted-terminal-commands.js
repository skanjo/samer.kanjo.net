module.exports = collection => {
	return collection.getFilteredByTag("terminal-command").sort(function(a, b){
		return a.data.title.localeCompare(b.data.title);
	});
};
