import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import hpp from "hpp";

import { default as routes } from "./routes";
import { ICustomException } from "./interfaces/exception.interfaces";
import CustomResponse from "./utils/handlers/response.handler";
import CustomException from "./utils/handlers/error.handler";

const app = express();

// APP MIDDLE-WARES
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());
app.disable("x-powered-by");

// CORS - only allow the configured client.
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

// APP ROUTES - all routes begin with /api
app.use("/api", routes);

// Default route
app.get("/", (req: Request, res: Response) => {
  return new CustomResponse(res).success(
    `Welcome to the ${
      process.env.APP_NAME || "Connvei"
    } API. All API routes begin with /api.`,
    {},
    200
  );
});

// 404
app.all("*", (req: Request, res: Response) => {
  const e: ICustomException = new CustomException(404, "Route not found.");
  return new CustomResponse(res, e).error(e.message, 404, {}, {
    path: req.originalUrl,
    method: req.method,
  });
});

// ERROR MIDDLEWARE
app.use(
  (err: ICustomException, req: Request, res: Response, next: NextFunction) => {
    if (
      process.env.NODE_ENV !== "production" ||
      err.name !== "CustomException"
    ) {
      console.error(err);
    }

    return new CustomResponse(res, err).error(
      err.name === "CustomException" ? err.message : "Something went wrong!",
      err.name === "CustomException" ? err.status || 500 : 500,
      {},
      err.name === "CustomException" ? err.meta : {}
    );
  }
);

export default app;
