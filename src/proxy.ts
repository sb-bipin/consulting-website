import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except api, admin, static assets and files with extensions
  matcher: ["/((?!api|admin|uploads|_next|_vercel|.*\\..*).*)"],
};
