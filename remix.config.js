/** @type {import('@remix-run/dev').AppConfig} */
export default {
    ignoredRouteFiles: ["**/.*"],
    serverModuleFormat: "esm",
    serverPlatform: "node",
    serverBuildTarget: "node-cjs", // hoặc để default tuỳ nhu cầu
};
