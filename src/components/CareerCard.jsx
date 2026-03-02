import { Link } from "react-router-dom";

function CareerCard({ career }) {
	return (
		<article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:shadow-md">
			<h3 className="text-lg font-semibold text-slate-900">{career.title}</h3>
			<p className="mt-2 text-sm text-slate-600">{career.description}</p>

			<div className="mt-4 space-y-2">
				<p className="text-sm text-slate-700">
					<span className="font-semibold">Required Skills: </span>
					{career.requiredSkills?.join(", ") || "N/A"}
				</p>
				<p className="text-sm text-slate-700">
					<span className="font-semibold">Salary Range: </span>
					{career.salaryRange || "N/A"}
				</p>
			</div>

			<Link
				to={`/roadmap?career=${encodeURIComponent(career.title)}`}
				className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
			>
				View Roadmap
			</Link>
		</article>
	);
}

export default CareerCard;
