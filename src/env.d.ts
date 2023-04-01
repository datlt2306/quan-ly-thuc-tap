interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_BASE_URL_API: string;
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface DataResponse extends Response {
    success: boolean,
    data: Object | Array | null,
    result?: Object | Array | null,
    status: string,
}