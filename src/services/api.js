import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

const authApi = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("authToken");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const status = error.response?.status;

		if (status !== 401 || originalRequest?._retry) {
			return Promise.reject(error);
		}

		const refreshToken = localStorage.getItem("refreshToken");
		if (!refreshToken) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		try {
			const refreshResponse = await authApi.post("/auth/refresh", { refreshToken });
			const newAccessToken = refreshResponse.data?.token;
			const newRefreshToken = refreshResponse.data?.refreshToken;

			if (!newAccessToken || !newRefreshToken) {
				throw new Error("Refresh token response invalid");
			}

			localStorage.setItem("authToken", newAccessToken);
			localStorage.setItem("refreshToken", newRefreshToken);

			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
			return api(originalRequest);
		} catch (refreshError) {
			localStorage.removeItem("authToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("currentUser");
			return Promise.reject(refreshError);
		}
	}
);

export default api;
