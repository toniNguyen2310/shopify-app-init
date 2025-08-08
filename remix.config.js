/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    serverBuildTarget: "vercel",
    server: "./server.js", // hoặc server.ts tùy bạn
    ignoredRouteFiles: ["**/.*"],
};
