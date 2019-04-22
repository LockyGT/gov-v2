app.service('notificationService', function($q, factory) {
	var self = this;
	self.postNotification = (notificationTitle, notificationBody, notificationIcon) =>{		
		return $q(function(resolve, reject) {
			let title = notificationTitle;
			let content = {
				body: notificationBody,
				icon: notificationIcon,
				vibrate: [200, 100, 200]
			};
			// Let's check if the browser supports notifications
			if (!("Notification" in window)) {
				let errResponse = {
						message: "not_supported"
				};
				reject(errResponse);
				alert("This browser does not support desktop notification");
			}

			// Let's check whether notification permissions have already been granted
			else if (Notification.permission === "granted") {
				// If it's okay let's create a notification
				var notification =  new Notification(title, content);
				//setTimeout(notification.close.bind(notification), 4000);
				let resp = {
						message: "posted"
				};
				resolve(resp);
			}

			// Otherwise, we need to ask the user for permission
			else if (Notification.permission !== 'denied') {
				Notification.requestPermission(function (permission) {
					// If the user accepts, let's create a notification
					if (permission === "granted") {
						var notification =  new Notification(title, content);
						//setTimeout(notification.close.bind(notification), 4000);
						let resp = {
								message: "posted"
						};
						resolve(resp);
					}else{
						let errResponse = {
								message: "permission_not_allowed"
						};
						reject(errResponse);
					}
				});
			}else{
				let errResponse = {
						message: "permission_uknown"
				};
				reject(errResponse);
			}
			// At last, if the user has denied notifications, and you 
			// want to be respectful there is no need to bother them any more.
		});
	};
	
});