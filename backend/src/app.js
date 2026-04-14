import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import userRoutesV1 from "./v1/routes/userRoutes.js";
import userRoutesV2 from "./v2/routes/userRoutes.js";
import userRoutesV3 from "./v3/routes/userRoutes.js";
import { buildDeprecationMiddleware } from "./middleware/deprecation.js";

const app = express();

/*       MiddleWares        */

const ratelimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per 10 minutes
  message: "Too many requests, please try again after 10 minutes",
});

app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(helmet());
app.use(morgan("dev"));
app.use(ratelimiter);

app.use(
  "/api/v1/users",
  buildDeprecationMiddleware({
    version: "v1",
    successor: "/api/v3/users",
    deprecationDate: "2026-04-01T00:00:00.000Z",
    sunsetDate: "2026-12-31T00:00:00.000Z",
    hardBlockAfterSunset: false,
  }),
  userRoutesV1,
);
app.use("/api/v2/users", userRoutesV2);
app.use("/api/v3/users", userRoutesV3);

// Legacy redirect preserves HTTP method/body using 308.
app.use("/legacy/users", (req, res) => {
  const tailPath = req.originalUrl.replace(/^\/legacy\/users/, "") || "";
  res.redirect(308, `/api/v3/users${tailPath}`);
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

export default app;
