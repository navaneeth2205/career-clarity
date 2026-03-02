import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { getAlerts } from "../services/careerService";

function Alerts() {
	const [alerts, setAlerts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const loadAlerts = async () => {
			setIsLoading(true);
			setErrorMessage("");

			try {
				const data = await getAlerts();
				setAlerts(data.alerts || []);
			} catch {
				setErrorMessage("Unable to fetch alerts right now.");
			} finally {
				setIsLoading(false);
			}
		};

		loadAlerts();
	}, []);

	return (
		<section className="space-y-4">
			<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
				<h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
				<p className="mt-2 text-sm text-slate-600">Admission deadlines, scholarships, and entrance exam notifications.</p>
			</div>

			{errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

			{isLoading ? (
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100">
					<Loader label="Loading alerts..." />
				</section>
			) : (
				<div className="grid gap-3">
					{alerts.map((alert) => (
						<article key={alert.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-indigo-100">
							<p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{alert.type}</p>
							<h3 className="mt-1 text-base font-semibold text-slate-900">{alert.title}</h3>
							<p className="mt-1 text-sm text-slate-600">Date: {alert.date}</p>
						</article>
					))}
				</div>
			)}
		</section>
	);
}

export default Alerts;
