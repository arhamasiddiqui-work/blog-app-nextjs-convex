import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./betterAuth/auth";
const http = httpRouter();
authComponent.registerRoutes(http, createAuth as any);
export default http;