import transporter from "../config/email";

const SENSITIVE_FOOTER = `
    <hr />
    <p>This email may contain sensitive information</p>
    <p>https://connvei.vercel.app</p>
`;

/**
 * Encapsulates every transactional email the API sends. Each method returns a
 * `{ status, message, meta }` result so the controllers can react uniformly.
 */
class Email {
  private email: string | string[];

  constructor(email: string | string[]) {
    this.email = email;
  }

  private async send(
    subject: string,
    content: string,
    bcc?: string,
    replyTo?: string,
  ) {
    try {
      const data = await transporter({
        email: this.email,
        subject,
        content,
        bcc,
        replyTo,
      });

      return { status: true, message: "Email sent successfully", meta: data };
    } catch (error) {
      return {
        status: false,
        message: "Failed to send email. Try again.",
        meta: error,
      };
    }
  }

  // Account activation link (pre-signup)
  async sendActivationEmail(token: string) {
    const content = `
      <p>Please use the following link to activate your account:</p>
      <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
      ${SENSITIVE_FOOTER}
    `;

    return this.send("Account activation link", content);
  }

  // Password reset link (forgot password)
  async sendResetEmail(token: string) {
    const content = `
      <p>Please use the following link to reset your password:</p>
      <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
      ${SENSITIVE_FOOTER}
    `;

    return this.send("Password reset link", content);
  }

  // Contact form message
  async sendContactEmail(name: string, email: string, message: string) {
    const content = `
      <h4>Email received from contact form:</h4>
      <p>Sender name: ${name}</p>
      <p>Sender email: ${email}</p>
      <p>Sender message: ${message}</p>
      ${SENSITIVE_FOOTER}
    `;

    return this.send(
      `Contact form - ${process.env.APP_NAME}`,
      content,
      "",
      email,
    );
  }

  // Message to a blog author
  async sendBlogAuthorEmail(name: string, email: string, message: string) {
    const content = `
      <h4>Message received from:</h4>
      <p>name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
      ${SENSITIVE_FOOTER}
    `;

    return this.send(
      `Someone messaged you from ${process.env.APP_NAME}`,
      content,
      process.env.MAIL_USERNAME,
      email,
    );
  }
}

export default Email;
