GitaApp = {
	key : undefined,

	setKey : function(key) {
		this.key = key;
	},

	getKey : function() {
		return this.key;
	},

	upload : function(file, progressCallback) {
		var self = this,
            formData = new FormData();

        if (!this.key)
			throw {
				code : 'INVALID_TOKEN',
				errorString : 'Secret key was not set.  Please try again later.'
			};

		var xhr = new XMLHttpRequest(), url = '/upload/' + this.key;

		if (progressCallback !== undefined) {
			xhr.upload.addEventListener('progress', progressCallback, false);
            xhr.upload.addEventListener('onload', function(){
                self.displayError({messsage: 'LOADED'});
            })
		}
        formData.append('files', file);
		xhr.open('POST', url, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("X-File-Name", file.fileName);
        xhr.setRequestHeader("X-File-Size", file.fileSize);
		xhr.send(formData);
    },

	download : function(num) {
		window.open('data:');
	},

    displayError: function(error) {
        var errors = undefined;

        if (!$.isArray(error)) {
            errors = new Array();
            errors.push(error);
        } else {
            errors = error;
        }

        for (var i = 0; i < errors.length; ++i) {
            $('#error > ul').prepend('<li>' + errors[i].message + '</li>');
        }

        $('#error').show(300, 'linear');
    },

    clearError: function() {
        $('#error > ul').html('');
        $('#error').hide();
    }
}