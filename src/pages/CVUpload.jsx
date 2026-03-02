import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { getCurrentUser } from "../services/authService";
import { uploadCV } from "../services/resumeService";

function CVUpload() {
	const inputRef = useRef(null);
	const navigate = useNavigate();
	const user = getCurrentUser();
	const isGraduate = user?.educationLevel === "Graduate";

	const [selectedFile, setSelectedFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const validateAndSetFile = (file) => {
		if (!file) {
			return;
		}

		if (file.type !== "application/pdf") {
			setErrorMessage("Only PDF files are allowed.");
			setSelectedFile(null);
			return;
		}

		setErrorMessage("");
		setSelectedFile(file);
	};

	const onFileChange = (event) => {
		validateAndSetFile(event.target.files?.[0]);
	};

	const onDropFile = (event) => {
		event.preventDefault();
		validateAndSetFile(event.dataTransfer.files?.[0]);
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setSuccessMessage("");

		if (!selectedFile) {
			setErrorMessage("Please select a PDF before uploading.");
			return;
		}

		setIsUploading(true);
		try {
			const analysis = await uploadCV(selectedFile);
			setSuccessMessage("CV uploaded successfully. Redirecting to analysis...");

			setTimeout(() => {
				navigate("/cv-analysis", { state: { analysis } });
			}, 700);
		} catch {
			setErrorMessage("CV upload failed. Please try again.");
		} finally {
			setIsUploading(false);
		}
	};

	if (!isGraduate) {
		return (
			<section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-indigo-100">
				<h1 className="text-2xl font-bold text-slate-900">CV Upload</h1>
				<p className="mt-3 text-sm text-slate-600">This feature is available only for users with Graduate education level.</p>
				<Link
					to="/dashboard"
					className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
				>
					Back to Dashboard
				</Link>
			</section>
		);
	}

	return (
		<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
			<h1 className="text-2xl font-bold text-slate-900">CV Upload</h1>
			<p className="mt-2 text-sm text-slate-600">Upload your resume in PDF format for AI-powered skill gap analysis.</p>

			<form onSubmit={onSubmit} className="mt-6 space-y-4">
				<div
					onDragOver={(event) => event.preventDefault()}
					onDrop={onDropFile}
					onClick={() => inputRef.current?.click()}
					role="button"
					tabIndex={0}
					onKeyDown={(event) => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							inputRef.current?.click();
						}
					}}
					className="cursor-pointer rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-100"
				>
					<p className="text-sm font-semibold text-indigo-700">Drag & drop PDF here</p>
					<p className="mt-1 text-xs text-slate-600">or click to choose file</p>
					{selectedFile && <p className="mt-3 text-sm text-slate-800">Selected: {selectedFile.name}</p>}
				</div>

				<input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={onFileChange} />

				{errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
				{successMessage && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

				<button
					type="submit"
					disabled={isUploading}
					className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
				>
					{isUploading ? <Loader label="Uploading CV..." size="sm" /> : "Upload CV"}
				</button>
			</form>
		</section>
	);
}

export default CVUpload;
