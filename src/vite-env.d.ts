/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Token de larga duración de la API de Instagram (Instagram Login). Opcional. */
  readonly VITE_INSTAGRAM_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
