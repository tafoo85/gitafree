GitaApp = {
	key : undefined,

	setKey : function(key) {
		this.key = key;
	},

	getKey : function() {
		return this.key;
	},

	upload : function(file, progressCallback) {
		if (!this.key)
			throw {
				code : 'INVALID_TOKEN',
				errorString : 'Secret key was not set.  Please try again later.'
			};

		var xhr = new XMLHttpRequest(), url = '/upload/' + this.key;

		if (progressCallback !== undefined) {
			xhr.upload.addEventListener('progress', progressCallback, false);
		}
		xhr.open('PUT', url);
		xhr.send(file);
	},

	download : function(num) {
		alert('should download a file.')
	}
}