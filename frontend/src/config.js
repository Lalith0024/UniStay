const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ BACKEND_URL is not defined in your environment!");
}


export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  PRODUCTS: `${API_BASE_URL}/products`,
};

export default API_BASE_URL;
