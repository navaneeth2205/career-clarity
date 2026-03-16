import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import CareerCard from "../components/CareerCard";
import { getCareerRecommendations } from "../services/careerService";

function Recommendations() {
	const [careers, setCareers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const loadRecommendations = async () => {
			setIsLoading(true);
			setErrorMessage("");

			try {
				const data = await getCareerRecommendations();
				setCareers((data.recommendations || []).slice(0, 3));
			} catch {
				setErrorMessage("Unable to load recommendations right now.");
			} finally {
				setIsLoading(false);
			}
		};

		loadRecommendations();
	}, []);

	if (isLoading) {
		return (
			<section className="cc-surface p-8">
				<Loader label="Loading recommendations..." />
			</section>
		);
	}

	return (
		<section className="space-y-4">
			<div className="cc-surface p-6 sm:p-8">
				<h1 className="cc-heading text-2xl font-extrabold text-slate-900">Top Career Recommendations</h1>
				<p className="mt-2 text-sm text-slate-600">Based on your profile and aptitude preferences.</p>
			</div>

			{errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

			<div className="grid gap-4 lg:grid-cols-3">
				{careers.map((career) => (
					<CareerCard key={career.title} career={career} />
				))}
			</div>
		</section>
	);
}

export default Recommendations;
