import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create instance
export const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor: Attach Token + Detect FormData + Default Headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🔥 Auto prevent caching only for GET requests
  if (config.method === "get") {
    config.params = {
      ...(config.params || {}), // keep existing params if any
      t: Date.now(), // add timestamp to bust cache
    };
  }

  // 🔥 Auto handle FormData
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Interceptor: Global Error Handling (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Safely extract backend message
    const message =
      err?.response?.data?.message || // backend { message: "" }
      err?.response?.message || // backend { message: "" }
      err?.response?.data?.error || // backend { error: "" }
      err?.response?.data?.errors || // backend { errors: [...] }
      err?.response?.statusText || // fallback
      "Something went wrong!"; // final fallback

    console.error("API Error:", message);

    // Auto logout if token expired
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // OPTIONAL → only if NOT login page
      // if (window.location.pathname !== "/login") {
      //   window.location.href = "/login";
      // }
    }

    // Always reject with readable error
    return Promise.reject({
      status: err?.response?.status,
      data: err?.response?.data,
      message,
    });
  }
);
