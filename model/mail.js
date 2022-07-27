"use strict"

var nodemailer = require('nodemailer');
var db = require('../controller/db_adaptor/mongodb.js');

var send = async (data, callback) => {
	try {
		let settings = await db.GetOneDocument('settings', { 'alias': 'smtp' }, {}, {});
		// if (settings && typeof settings.settings != "undefined" && settings.settings != "" && settings.settings.mode == 'production') {
			var smtp_host = "smtp.gmail.com";
			var smtp_port = 465;
			var smtp_username = "<< USE YOUR EMAIL ID >>>>@gmail.com";
			var smtp_password = "dsdsds"; //
			var transporter = nodemailer.createTransport({
				host: smtp_host,
				port: smtp_port,
				secure: true,
				// auth: {
				// 	user: smtp_username,
				// 	pass: smtp_password
				// },
				tls: {
					rejectUnauthorized: false
				}
			});
			transporter.sendMail(data, (error, info) => {
				callback(error, info, { mode: 2 });
			});
		// } else {
		// 	callback(null, null, { mode: 4 });
		// }
	} catch (err) {
		callback(err, null, { mode: 3 });
	}
}

module.exports = {
	"send": send
};
