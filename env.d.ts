/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />
declare module "*.json" {
    const value: any;
    export default value;
}

// Hỗ trợ import assertions
declare module "*" {
    const content: any;
    export default content;
}