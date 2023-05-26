/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly PACKAGE_VERSION: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
