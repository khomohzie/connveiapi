const transporter = require("../helpers/email");

exports.contactForm = async (req, res) => {
	const { email, name, message } = req.body;

	const mg = `
            <h4>Email received from contact form:</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://connvei.vercel.app</p>
        `;

	await transporter(email, `Contact form - ${process.env.APP_NAME}`, mg)
		.then((data) => {
			return res.json({
				success: true,
				data: data,
			});
		})
		.catch((err) => {
			return res.json({
				message: "Failed to send email",
				error: err,
			});
		});
};

exports.contactBlogAuthorForm = async (req, res) => {
	const { authorEmail, email, name, message } = req.body;
	// console.log(req.body);

	let maillist = [authorEmail, process.env.EMAIL_TO];

	const mg = `
            <h4>Message received from:</h4>
            <p>name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://connvei.vercel.app</p>
        `;

	await transporter(
		maillist,
		`Someone messaged you from ${process.env.APP_NAME}`,
		mg,
		email
	)
		.then((data) => {
			return res.json({
				success: true,
				data: data,
			});
		})
		.catch((err) => {
			return res.json({
				message: "Failed to send email",
				error: err,
			});
		});
};
