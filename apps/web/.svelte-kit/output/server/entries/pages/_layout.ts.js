import { redirect } from "@sveltejs/kit";
import "clsx";
const prerender = true;
const ssr = false;
const publicRoutes = [
  "/",
  "/how-to-play",
  "/faqs",
  "/terms",
  "/auth/login",
  "/auth/register",
  "/auth/forgot",
  "/auth/reset"
];
const previewRoutes = [
  "/contests"
];
const requiredAuthRoutes = [
  "/dashboard",
  "/wallet",
  "/my-teams",
  "/team-builder",
  "/live",
  "/results",
  "/profile",
  "/admin"
];
const load = async ({ url, depends }) => {
  depends("auth:user");
  const pathname = url.pathname;
  let isAuthenticated = false;
  const requiresAuth = requiredAuthRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isPreviewRoute = previewRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (requiresAuth && !isAuthenticated) {
    const returnTo = encodeURIComponent(pathname + url.search);
    throw redirect(302, `/auth/login?returnTo=${returnTo}`);
  }
  return {
    isAuthenticated,
    requiresAuth,
    isPublicRoute,
    isPreviewRoute,
    pathname,
    publicRoutes,
    previewRoutes,
    requiredAuthRoutes
  };
};
export {
  load,
  prerender,
  ssr
};
