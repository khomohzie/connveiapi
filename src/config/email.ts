import { google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";

/**
 * Email is sent through the Gmail API (over HTTPS / port 443) instead of SMTP.
 *
 * Hosts such as Render block outbound SMTP ports (465/587), so the SMTP based
 * Gmail transport that works locally silently fails once deployed. The Gmail
 * API is unaffected by that restriction.
 *
 * Requirements:
 *   - Enable the "Gmail API" for the project in Google Cloud Console.
 *   - An OAuth2 client (client id + secret) and a refresh token generated for
 *     the sending account (e.g. via the OAuth Playground) with the
 *     `https://mail.google.com/` (or `gmail.send`) scope.
 */

const OAUTH_CLIENT_ID =
  process.env.OAUTH_CLIENT_ID || process.env.OAUTH_CLIENTID;
const FROM_EMAIL = process.env.OAUTH_EMAIL || process.env.MAIL_USERNAME;

// The OAuth2 client refreshes the short-lived access token on its own using the
// refresh token. Created once and reused for every message.
const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

const transporter = ({
  email,
  subject,
  content,
  bcc,
  replyTo,
}: {
  email: string | string[];
  subject: string;
  content: string;
  bcc?: string;
  replyTo?: string;
}): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Build a raw RFC-822 message. The Gmail API always sends as the
      // authenticated account, so the submitter's address (if any) is used as
      // Reply-To rather than From.
      const mail = new MailComposer({
        from: `"${process.env.APP_NAME}" <${FROM_EMAIL}>`,
        to: email,
        replyTo: replyTo,
        bcc,
        subject,
        html: content,
        textEncoding: "base64",
      });

      // The Gmail API reads recipients from the message headers - there is no
      // separate SMTP envelope - so the Bcc header must survive into the raw
      // message or the Bcc recipient never receives the email. MailComposer
      // strips it by default; `keepBcc` retains it. Gmail still removes the
      // header from the copies delivered to the other recipients, so blind
      // copy privacy is preserved.
      const compiled = mail.compile();
      (compiled as any).keepBcc = true;

      const message: Buffer = await new Promise((res, rej) => {
        compiled.build((err, msg) => (err ? rej(err) : res(msg)));
      });

      // base64url-encode the message per the Gmail API contract.
      const rawMessage = message
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const result = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: rawMessage },
      });

      console.log("Email sent successfully:", result.data.id);
      resolve(result.data);
    } catch (error) {
      console.error("Error sending email:", error);
      reject(error);
    }
  });
};

export default transporter;
