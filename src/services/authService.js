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

	if (data?.user) {
		localStorage.setItem("currentUser", JSON.stringify(data.user));
	}
}

export function getCurrentUser() {
	try {
		const rawUser = localStorage.getItem("currentUser");
		return rawUser ? JSON.parse(rawUser) : null;
	} catch {
		return null;
	}
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
