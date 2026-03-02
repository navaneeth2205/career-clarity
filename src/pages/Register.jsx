import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../components/Loader";
import { EDUCATION_LEVELS, registerUser, saveAuthSession } from "../services/authService";

const initialFormData = {
	name: "",
	email: "",
	password: "",
	educationLevel: "Class 12",
};

function Register() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState(initialFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const onChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setSuccessMessage("");
		setIsLoading(true);

		try {
			const response = await registerUser(formData);
			saveAuthSession(response);
			setSuccessMessage("Registration successful. Redirecting to dashboard...");
			setFormData(initialFormData);

			setTimeout(() => {
				navigate("/dashboard");
			}, 800);
		} catch (error) {
			setErrorMessage(error.response?.data?.message || "Unable to register. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="cc-surface mx-auto w-full max-w-lg p-6 sm:p-8">
			<h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
			<p className="mt-2 text-sm text-slate-600">Start your personalized education and career guidance journey.</p>

			<form onSubmit={onSubmit} className="mt-6 space-y-4">
				<div>
					<label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
						Full Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						value={formData.name}
						onChange={onChange}
						required
						className="cc-input"
					/>
				</div>

				<div>
					<label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						value={formData.email}
						onChange={onChange}
						required
						className="cc-input"
					/>
				</div>

				<div>
					<label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						value={formData.password}
						onChange={onChange}
						required
						minLength={6}
						className="cc-input"
					/>
				</div>

				<div>
					<label htmlFor="educationLevel" className="mb-1 block text-sm font-medium text-slate-700">
						Education Level
					</label>
					<select
						id="educationLevel"
						name="educationLevel"
						value={formData.educationLevel}
						onChange={onChange}
						required
						className="cc-input bg-white"
					>
						{EDUCATION_LEVELS.map((level) => (
							<option key={level} value={level}>
								{level}
							</option>
						))}
					</select>
				</div>

				{errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
				{successMessage && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

				<button
					type="submit"
					disabled={isLoading}
					className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{isLoading ? <Loader label="Creating account..." size="sm" /> : "Register"}
				</button>
			</form>

			<p className="mt-5 text-center text-sm text-slate-600">
				Already have an account?{" "}
				<Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
					Login
				</Link>
			</p>
		</section>
	);
}

export default Register;
