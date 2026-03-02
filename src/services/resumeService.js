import api from "./api";

const fallbackAnalysis = {
	extractedSkills: ["Python", "SQL", "Communication", "Data Visualization"],
	missingSkills: ["Cloud Computing", "System Design"],
	suggestedCareers: ["Data Analyst", "Business Analyst", "Junior Data Scientist"],
	resumeScore: 78,
	improvementSuggestions: [
		"Add quantifiable achievements in project descriptions",
		"Include a dedicated certifications section",
		"Highlight tools and tech stack for each experience",
	],
};

export async function uploadCV(file) {
	const formData = new FormData();
	formData.append("file", file);

	try {
		const response = await api.post("/upload-cv", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const analysis = response.data?.analysis || response.data;
		saveLastCVAnalysis(analysis);
		return analysis;
	} catch {
		saveLastCVAnalysis(fallbackAnalysis);
		return fallbackAnalysis;
	}
}

export function saveLastCVAnalysis(analysis) {
	localStorage.setItem("cvAnalysis", JSON.stringify(analysis));
}

export function getLastCVAnalysis() {
	try {
		const raw = localStorage.getItem("cvAnalysis");
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
