/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ["**/.*"],
    serverModuleFormat: "cjs",
    serverPlatform: "node",
    serverMinify: process.env.NODE_ENV === "production",
    serverDependenciesToBundle: [
        "@shopify/shopify-app-remix",
        /^@shopify\/shopify-app-session-storage.*/,
    ],
    future: {
        v2_errorBoundary: true,
        v2_headers: true,
        v2_meta: true,
        v2_normalizeFormMethod: true,
        v2_routeConvention: true,
    },
};