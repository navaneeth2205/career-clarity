import { useState } from "react";
import Loader from "../components/Loader";
import { getCurrentUser, updateUserProfile } from "../services/authService";

const interestOptions = ["Technology", "Design", "Business", "Science", "Healthcare", "Government Exams"];

function Profile() {
	const currentUser = getCurrentUser();
	const [formData, setFormData] = useState({
		name: currentUser?.name || "",
		educationLevel: currentUser?.educationLevel || "Class 12",
		interests: currentUser?.interests || [],
		skills: currentUser?.skills || "",
		preferredLocation: currentUser?.preferredLocation || "",
		careerGoal: currentUser?.careerGoal || "",
	});
	const [isEditMode, setIsEditMode] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [status, setStatus] = useState({ type: "", message: "" });

	const onChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const onToggleInterest = (interest) => {
		setFormData((prev) => {
			const hasInterest = prev.interests.includes(interest);
			const updated = hasInterest ? prev.interests.filter((item) => item !== interest) : [...prev.interests, interest];
			return { ...prev, interests: updated };
		});
	};

	const onSave = async () => {
		setIsSaving(true);
		setStatus({ type: "", message: "" });

		try {
			await updateUserProfile(formData);
			setStatus({ type: "success", message: "Profile updated successfully." });
			setIsEditMode(false);
		} catch {
			setStatus({ type: "error", message: "Unable to update profile. Please retry." });
		} finally {
			setIsSaving(false);
		}
	};

	const isDisabled = !isEditMode || isSaving;

	return (
		<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl font-bold text-slate-900">Profile</h1>
				<button
					type="button"
					onClick={() => setIsEditMode((prev) => !prev)}
					className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
				>
					{isEditMode ? "Cancel" : "Edit Profile"}
				</button>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-2">
				<div>
					<label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
					<input
						name="name"
						value={formData.name}
						onChange={onChange}
						disabled={isDisabled}
						className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-slate-700">Education Level</label>
					<input
						name="educationLevel"
						value={formData.educationLevel}
						onChange={onChange}
						disabled={isDisabled}
						className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-slate-700">Skills</label>
					<input
						name="skills"
						value={formData.skills}
						onChange={onChange}
						disabled={isDisabled}
						placeholder="Ex: Python, UI Design"
						className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-slate-700">Preferred Location</label>
					<input
						name="preferredLocation"
						value={formData.preferredLocation}
						onChange={onChange}
						disabled={isDisabled}
						placeholder="Ex: Bengaluru"
						className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
					/>
				</div>
			</div>

			<div className="mt-4">
				<label className="mb-2 block text-sm font-medium text-slate-700">Interests</label>
				<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{interestOptions.map((interest) => (
						<label key={interest} className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm text-slate-700">
							<input
								type="checkbox"
								checked={formData.interests.includes(interest)}
								onChange={() => onToggleInterest(interest)}
								disabled={isDisabled}
							/>
							{interest}
						</label>
					))}
				</div>
			</div>

			<div className="mt-4">
				<label className="mb-1 block text-sm font-medium text-slate-700">Career Goal</label>
				<textarea
					name="careerGoal"
					value={formData.careerGoal}
					onChange={onChange}
					disabled={isDisabled}
					rows={4}
					className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
				/>
			</div>

			{status.message && (
				<p className={`mt-4 rounded-xl px-3 py-2 text-sm ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
					{status.message}
				</p>
			)}

			{isEditMode && (
				<button
					type="button"
					onClick={onSave}
					disabled={isSaving}
					className="mt-5 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
				>
					{isSaving ? <Loader label="Saving..." size="sm" /> : "Save Profile"}
				</button>
			)}
		</section>
	);
}

export default Profile;
