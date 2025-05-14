const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
const isBeta = import.meta.env.VITE_ENABLE_BETA_FEATURE === "true";
const version = import.meta.env.VITE_VITE_APP_VERSION || "";

export { apiUrl, isBeta, version };
