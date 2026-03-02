import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import { getCareerRoadmap } from "../services/careerService";

function Roadmap() {
	const [searchParams] = useSearchParams();
	const careerParam = searchParams.get("career") || "Software Developer";
	const [roadmap, setRoadmap] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const loadRoadmap = async () => {
			setIsLoading(true);
			setErrorMessage("");

			try {
				const data = await getCareerRoadmap(careerParam);
				setRoadmap(data);
			} catch {
				setErrorMessage("Unable to load roadmap currently.");
			} finally {
				setIsLoading(false);
			}
		};

		loadRoadmap();
	}, [careerParam]);

	if (isLoading) {
		return (
			<section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-indigo-100">
				<Loader label="Loading roadmap..." />
			</section>
		);
	}

	if (!roadmap) {
		return <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage || "No roadmap available."}</p>;
	}

	return (
		<section className="space-y-4">
			<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
				<h1 className="text-2xl font-bold text-slate-900">Career Roadmap: {roadmap.career}</h1>
				<p className="mt-2 text-sm text-slate-600">Step-by-step guidance to reach your career goal.</p>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100">
					<h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
					<ol className="mt-3 space-y-2 text-sm text-slate-700">
						{roadmap.steps?.map((step, index) => (
							<li key={step} className="flex gap-3">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
									{index + 1}
								</span>
								<span>{step}</span>
							</li>
						))}
					</ol>
				</div>

				<div className="space-y-4">
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100">
						<h2 className="text-lg font-semibold text-slate-900">Required Exams</h2>
						<ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
							{roadmap.exams?.map((exam) => (
								<li key={exam}>{exam}</li>
							))}
						</ul>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100">
						<h2 className="text-lg font-semibold text-slate-900">Required Certifications</h2>
						<ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
							{roadmap.certifications?.map((certificate) => (
								<li key={certificate}>{certificate}</li>
							))}
						</ul>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100">
						<h2 className="text-lg font-semibold text-slate-900">Skill Roadmap</h2>
						<div className="mt-3 flex flex-wrap gap-2">
							{roadmap.skillRoadmap?.map((skill) => (
								<span key={skill} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
									{skill}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Roadmap;
