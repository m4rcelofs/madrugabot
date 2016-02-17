module.exports = function() {
	var restart = function() {
		console.error('Automatically restarting...');
		process.exit(0);
	};
    
    setTimeout(restart, 1000 * 60 * 60 * 8);
};