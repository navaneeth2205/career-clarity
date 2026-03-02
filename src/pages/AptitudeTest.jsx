import { useMemo, useState } from "react";
import Loader from "../components/Loader";
import { submitAptitudeAnswers } from "../services/careerService";

const questions = [
	{
		id: 1,
		question: "Which activity do you enjoy the most?",
		options: ["Solving coding problems", "Designing visuals", "Analyzing numbers", "Leading teams"],
	},
	{
		id: 2,
		question: "What type of tasks are you best at?",
		options: ["Logical reasoning", "Creative ideation", "Research and analysis", "Communication"],
	},
	{
		id: 3,
		question: "Which work environment do you prefer?",
		options: ["Tech product company", "Design studio", "Consulting firm", "Public service"],
	},
];

function AptitudeTest() {
	const [answers, setAnswers] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
	const progress = Math.round((answeredCount / questions.length) * 100);

	const onSelectOption = (questionId, option) => {
		setAnswers((prev) => ({ ...prev, [questionId]: option }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setSuccessMessage("");

		if (answeredCount < questions.length) {
			setErrorMessage("Please answer all questions before submitting.");
			return;
		}

		setIsSubmitting(true);
		try {
			await submitAptitudeAnswers({ answers });
			setSuccessMessage("Aptitude test submitted successfully.");
		} catch (error) {
			setErrorMessage(error.response?.data?.message || "Submission failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
			<h1 className="text-2xl font-bold text-slate-900">Aptitude Test</h1>
			<p className="mt-2 text-sm text-slate-600">Answer all questions to get personalized career recommendations.</p>

			<div className="mt-4">
				<div className="flex items-center justify-between text-sm text-slate-600">
					<span>Progress</span>
					<span>{progress}%</span>
				</div>
				<div className="mt-2 h-2.5 rounded-full bg-slate-100">
					<div className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${progress}%` }} />
				</div>
			</div>

			<form onSubmit={onSubmit} className="mt-6 space-y-5">
				{questions.map((item) => (
					<fieldset key={item.id} className="rounded-xl border border-slate-200 p-4">
						<legend className="px-1 text-sm font-semibold text-slate-800">{item.question}</legend>
						<div className="mt-3 grid gap-2 sm:grid-cols-2">
							{item.options.map((option) => (
								<label key={option} className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-slate-700">
									<input
										type="radio"
										name={`q-${item.id}`}
										value={option}
										checked={answers[item.id] === option}
										onChange={() => onSelectOption(item.id, option)}
									/>
									{option}
								</label>
							))}
						</div>
					</fieldset>
				))}

				{errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
				{successMessage && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

				<button
					type="submit"
					disabled={isSubmitting}
					className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
				>
					{isSubmitting ? <Loader label="Submitting..." size="sm" /> : "Submit Answers"}
				</button>
			</form>
		</section>
	);
}

export default AptitudeTest;
