import { Link, useLocation } from "react-router-dom";
import { getLastCVAnalysis } from "../services/resumeService";

function CVAnalysis() {
	const location = useLocation();
	const analysis = location.state?.analysis || getLastCVAnalysis();

	if (!analysis) {
		return (
			<section className="cc-surface p-8">
				<h1 className="cc-heading text-2xl font-extrabold text-slate-900">CV Analysis</h1>
				<p className="mt-3 text-sm text-slate-600">No analysis found yet. Please upload a CV first.</p>
				<Link
					to="/cv-upload"
					className="cc-cta mt-5 inline-flex px-5 py-2.5 text-sm"
				>
					Go to CV Upload
				</Link>
			</section>
		);
	}

	const score = Number(analysis.resumeScore || 0);

	return (
		<section className="space-y-4">
			<div className="cc-surface p-6 sm:p-8">
				<h1 className="cc-heading text-2xl font-extrabold text-slate-900">CV Analysis Result</h1>
				<p className="mt-2 text-sm text-slate-600">AI-generated resume insights and improvement plan.</p>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<div className="cc-surface p-6">
					<h2 className="cc-heading text-lg font-bold text-slate-900">Extracted Skills</h2>
					<div className="mt-3 flex flex-wrap gap-2">
						{analysis.extractedSkills?.map((skill) => (
							<span key={skill} className="rounded-full border border-indigo-200 bg-indigo-100/70 px-3 py-1 text-xs font-semibold text-indigo-700">
								{skill}
							</span>
						))}
					</div>
				</div>

				<div className="cc-surface p-6">
					<h2 className="cc-heading text-lg font-bold text-slate-900">Missing Skills</h2>
					<div className="mt-3 flex flex-wrap gap-2">
						{analysis.missingSkills?.map((skill) => (
							<span key={skill} className="rounded-full border border-amber-200 bg-amber-100/70 px-3 py-1 text-xs font-semibold text-amber-700">
								{skill}
							</span>
						))}
					</div>
				</div>

				<div className="cc-surface p-6">
					<h2 className="cc-heading text-lg font-bold text-slate-900">Suggested Careers</h2>
					<ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
						{analysis.suggestedCareers?.map((career) => (
							<li key={career}>{career}</li>
						))}
					</ul>
				</div>

				<div className="cc-surface p-6">
					<h2 className="cc-heading text-lg font-bold text-slate-900">Resume Score</h2>
					<p className="mt-3 text-3xl font-bold text-indigo-600">{score}/100</p>
					<div className="mt-3 h-2.5 rounded-full bg-slate-100">
						<div className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${score}%` }} />
					</div>
				</div>
			</div>

			<div className="cc-surface p-6">
				<h2 className="cc-heading text-lg font-bold text-slate-900">Improvement Suggestions</h2>
				<ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
					{analysis.improvementSuggestions?.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default CVAnalysis;
