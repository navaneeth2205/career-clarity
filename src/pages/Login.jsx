import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../components/Loader";
import { loginUser, saveAuthSession } from "../services/authService";

const initialFormData = {
	email: "",
	password: "",
};

function Login() {
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
			const response = await loginUser(formData);
			saveAuthSession(response);
			setSuccessMessage("Login successful. Redirecting to dashboard...");
			setFormData(initialFormData);

			setTimeout(() => {
				navigate("/dashboard");
			}, 800);
		} catch (error) {
			setErrorMessage(error.response?.data?.message || "Invalid credentials. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="cc-surface mx-auto w-full max-w-lg p-6 sm:p-8">
			<h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
			<p className="mt-2 text-sm text-slate-600">Login to continue your personalized career guidance journey.</p>

			<form onSubmit={onSubmit} className="mt-6 space-y-4">
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

				{errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
				{successMessage && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

				<button
					type="submit"
					disabled={isLoading}
					className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{isLoading ? <Loader label="Signing in..." size="sm" /> : "Login"}
				</button>
			</form>

			<p className="mt-5 text-center text-sm text-slate-600">
				Don&apos;t have an account?{" "}
				<Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
					Register
				</Link>
			</p>
		</section>
	);
}

export default Login;
