import { TUser } from "./src/models/user.model";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      APP_NAME: string;
      CLIENT_URL: string;

      // Database
      DATABASE: string;
      DATABASE_CLOUD: string;

      // JWT
      JWT_SECRET: string;
      JWT_ACCOUNT_ACTIVATION: string;
      JWT_RESET_PASSWORD: string;

      // Google OAuth login
      GOOGLE_CLIENT_ID: string;

      // Nodemailer (Gmail OAuth2)
      MAIL_USERNAME: string;
      MAIL_PASSWORD: string;
      OAUTH_CLIENTID: string;
      OAUTH_CLIENT_SECRET: string;
      OAUTH_REFRESH_TOKEN: string;
      EMAIL_TO: string;
      EMAIL_FROM: string;

      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_URL: string;
    }
  }

  namespace Express {
    export interface Request {
      // Set by requireSignin after a valid Bearer token is decoded.
      user: { _id: string };
      // Set by authMiddleware / adminMiddleware - the full user document.
      profile: TUser & { _id: any };
    }
  }
}

export {};
