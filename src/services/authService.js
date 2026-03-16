import api from "./api";

export const EDUCATION_LEVELS = ["Class 10", "Class 12", "Undergraduate", "Graduate"];

export async function registerUser(payload) {
	const response = await api.post("/auth/register", payload);
	return response.data;
}

export async function loginUser(payload) {
	const response = await api.post("/auth/login", payload);
	return response.data;
}

export function saveAuthSession(data) {
	if (data?.token) {
		localStorage.setItem("authToken", data.token);
	}

	if (data?.refreshToken) {
		localStorage.setItem("refreshToken", data.refreshToken);
	}

	if (data?.user) {
		localStorage.setItem("currentUser", JSON.stringify(data.user));
	}
}

export function clearAuthSession() {
	localStorage.removeItem("authToken");
	localStorage.removeItem("refreshToken");
	localStorage.removeItem("currentUser");
}

export function getCurrentUser() {
	try {
		const rawUser = localStorage.getItem("currentUser");
		return rawUser ? JSON.parse(rawUser) : null;
	} catch {
		return null;
	}
}

export function isAuthenticated() {
	return Boolean(localStorage.getItem("authToken"));
}

export function isGraduateUser() {
	const user = getCurrentUser();
	return user?.educationLevel === "Graduate";
}

export async function updateUserProfile(payload) {
	try {
		const response = await api.put("/users/profile", payload);
		if (response.data?.user) {
			localStorage.setItem("currentUser", JSON.stringify(response.data.user));
		}
		return response.data;
	} catch {
		const existing = getCurrentUser() || {};
		const updated = { ...existing, ...payload };
		localStorage.setItem("currentUser", JSON.stringify(updated));
		return { user: updated };
	}
}

export async function logoutUser() {
	const refreshToken = localStorage.getItem("refreshToken");

	try {
		if (refreshToken) {
			await api.post("/auth/logout", { refreshToken });
		}
	} finally {
		clearAuthSession();
	}
}

export async function getMyProfile() {
	const response = await api.get("/users/me");
	return response.data;
}

export async function syncCurrentUser() {
	if (!isAuthenticated()) {
		return null;
	}

	try {
		const data = await getMyProfile();
		if (data?.user) {
			localStorage.setItem("currentUser", JSON.stringify(data.user));
		}
		return data?.user || null;
	} catch {
		clearAuthSession();
		return null;
	}
}
