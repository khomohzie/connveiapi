import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Nodemailer natively handles the Gmail OAuth2 flow: given the clientId,
 * clientSecret and refreshToken it fetches/refreshes the access token on its
 * own.
 */
const createTransporter = async (): Promise<
  | nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  | Error
> => {
  try {
    const options: SMTPTransport.Options = {
      service: "gmail",
      // `pass` is kept alongside the OAuth2 credentials to match the original
      // config; nodemailer falls back to it if the OAuth2 flow is unavailable.
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      } as any,
    };

    const transporter = nodemailer.createTransport(options);

    return transporter;
  } catch (err) {
    console.error("Error creating transporter:", err);
    return err as Error;
  }
};

const transporter = ({
  email,
  subject,
  content,
  sender = process.env.MAIL_USERNAME,
}: {
  email: string | string[];
  subject: string;
  content: string;
  sender?: string;
}): Promise<SMTPTransport.SentMessageInfo> => {
  return new Promise(async (resolve, reject) => {
    const emailTransporter = await createTransporter();

    if (emailTransporter instanceof Error) {
      console.error(
        "Failed to create email transporter:",
        emailTransporter.message
      );

      return reject(emailTransporter);
    }

    await emailTransporter
      .sendMail({
        from: sender,
        to: email,
        subject,
        text: content,
        html: content,
      })
      .then((msg) => {
        console.log(msg);
        resolve(msg);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

export default transporter;
