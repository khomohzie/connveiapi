const nodemailer = require("nodemailer");

const nm = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
		clientId: process.env.OAUTH_CLIENTID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		refreshToken: process.env.OAUTH_REFRESH_TOKEN,
	},
});

const transporter = (
	email,
	subject,
	content,
	sender = process.env.MAIL_USERNAME
) => {
	return new Promise((resolve, reject) => {
		nm.sendMail({
			from: sender,
			to: email,
			subject: subject,
			text: content,
			html: content,
		})
			.then((msg) => {
				console.log(msg);
				resolve(msg);
			}) // logs response data
			.catch((err) => {
				console.error(err);
				reject(err);
			}); // logs any error
	});
};

module.exports = transporter;
