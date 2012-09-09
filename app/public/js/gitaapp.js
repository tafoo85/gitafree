GitaApp = {
	key : undefined,
	socket : undefined,
	RETRY_LIMIT : 3,
	
	setKey : function(key) {
		this.key = key;
	},

	getKey : function() {
		return this.key;
	},

	upload : function(file, progressCallback) {
		if (!this.key)
			throw new Error();
			
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
		alert('should download a file.')
	},
	
	
	onDisconnect : function(message) {
		if(attempts++ < RETRY_LIMIT) {
			socket = new io.connect('ws://' + window.location.host);
		}
		else {
			throw new Error();
		}			
	},
	
	onFileReady : function(message) {
		var payload = message.payload;
		
		if(GitaApp.getKey() === payload.key) {
			for(var i = 0; i < payload.numFiles; ++i)
				GitaApp.download(i);
		} else {
			throw new Error();
		}
	},
	
	onKeyReady : function(message) {
		var payload = message.payload;
		
		$('<span>' + payload.key + '</span>').appendTo('#keylabel');
		this.setKey(payload.key);
		this.uploadHandler(files);
	},
	
	uploadHandler : function(files) {
		for(var i = 0; i < files.length; ++i) {
			try {
				GitaApp.upload(files[i]);
			} catch(exception) {
				$('#keylabel > span').html('');
        		GitaApp.displayError(exception);
			}
		}
	},
	
	bindWidgetEvents : function() {
		$('#sendbox').on('drop', function(event) {
			event.stopPropagation();
			event.preventDefault();
					
			var vanillaEvent = event.originalEvent,
				files = vanillaEvent.target.fileList || vanillaEvent.dataTransfer.files;
			if (!GitaApp.getKey()) {
				this.socket.emit('KEY_REQUEST', {});
			}
			else {
				this.uploadHandler(files);
			}
		});

		$('#receivebutton').click(function(event) {
			var friendskey = $('friendskey').val();
			socket.emit('FILE_REQUEST', {payload: { key: friendskey }})
		});
	},
	
	initialize : function(intiOptions) {
		this.socket = new io.connect('ws://' + window.location.host);
		this.socket.on('disconnect', this.onDisconnect);
		this.socket.on('FILE_READY', this.onFileReady);
		this.socket.on('INVALID_KEY', this.onInvalidKey);
		this.socket.on('KEY_READY', this.onKeyReady);
		this.bindWidgetEvents();
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